import { useEffect, useRef, useState } from 'react'

/*
 * "A" da abertura: uma animação contínua de 10 s em que uma letra azul
 * vira, em sequência, cada uma das próximas — sem
 * fade, só a forma se transformando até virar a seguinte.
 *
 * Como funciona: cada PNG vira um campo de distância (SDF) e o shader
 * interpola os campos entre si (a borda "escorre" de uma letra pra outra).
 * Os 4 campos ficam nos 4 canais (RGBA) de uma única textura.
 *
 * Pra trocar a ordem ou as letras, mexa em SHAPES (PNG com fundo transparente).
 */
const SHAPES = ['/morph/a1.png', '/morph/a2.png', '/morph/a3.png', '/morph/a4.png']

const N = 1024 // resolução do campo de distância
const FILL = 0.62 // quanto do quadrado a letra ocupa

// linha do tempo (segundos): cada letra fica parada um instante (HOLD) e vira a
// próxima em MORPH segundos; a última volta pra primeira, fechando o ciclo.
const MORPH = 0.2
const HOLD = 0.4
const STEP = MORPH + HOLD
const LOOP = 4 * STEP // ciclo = 4 letras × (pausa + transição), sem tempo sobrando
const MORPHS = Array.from({ length: 4 }, (_, i) => [HOLD + i * STEP, HOLD + i * STEP + MORPH])

const VERT = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uScale;
uniform vec4 uW;
uniform vec3 uColor;
uniform sampler2D uTex;
out vec4 outColor;

const float BOXH = 0.58;

float shapeSdf(vec2 uv) {
  float v = dot(texture(uTex, uv), uW);
  return v;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / (min(uRes.x, uRes.y) * 0.5 * uScale);
  p.y = -p.y;
  vec2 uv = p / (2.0 * BOXH) + 0.5;

  float sdf = shapeSdf(uv);
  float fw = max(fwidth(sdf), 1e-6);
  float a = 1.0 - smoothstep(-fw, fw, sdf);
  outColor = vec4(uColor * a, a);
}`

const smoother = (t) => {
  const x = Math.min(1, Math.max(0, t))
  return x * x * x * (x * (x * 6 - 15) + 10)
}

// --- campo de distância ---------------------------------------------------
// Transformada de distância euclidiana 1D (Felzenszwalb) aplicada em linhas e colunas.
function edt1d(f, n, d, v, z) {
  let k = 0
  v[0] = 0
  z[0] = -Infinity
  z[1] = Infinity
  for (let q = 1; q < n; q++) {
    let s
    while (true) {
      const p = v[k]
      s = (f[q] + q * q - (f[p] + p * p)) / (2 * q - 2 * p)
      if (s <= z[k]) k--
      else break
    }
    k++
    v[k] = q
    z[k] = s
    z[k + 1] = Infinity
  }
  k = 0
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]]
  }
}

// distância (px) de cada pixel até o pixel "ligado" mais próximo (mask === on)
function distanceTo(mask, on) {
  const INF = 1e12
  const grid = new Float64Array(N * N)
  for (let i = 0; i < N * N; i++) grid[i] = mask[i] === on ? 0 : INF
  const f = new Float64Array(N)
  const d = new Float64Array(N)
  const v = new Int32Array(N)
  const z = new Float64Array(N + 1)
  for (let x = 0; x < N; x++) {
    for (let y = 0; y < N; y++) f[y] = grid[y * N + x]
    edt1d(f, N, d, v, z)
    for (let y = 0; y < N; y++) grid[y * N + x] = d[y]
  }
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) f[x] = grid[y * N + x]
    edt1d(f, N, d, v, z)
    for (let x = 0; x < N; x++) grid[y * N + x] = Math.sqrt(d[x])
  }
  return grid
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// PNG transparente -> campo de distância com sinal (negativo dentro), 0..255
function buildSdf(img) {
  // 1) acha a caixa da letra pelo alfa. Desenha sempre em alta resolução
  // (PNG ou SVG — um SVG é rasterizado nítido nesse tamanho).
  const probe = document.createElement('canvas')
  const aspect = (img.naturalHeight || 1) / (img.naturalWidth || 1)
  probe.width = N
  probe.height = Math.max(1, Math.round(N * aspect))
  const pctx = probe.getContext('2d', { willReadFrequently: true })
  pctx.imageSmoothingQuality = 'high'
  pctx.drawImage(img, 0, 0, probe.width, probe.height)
  const { data, width, height } = pctx.getImageData(0, 0, probe.width, probe.height)
  let minX = width, minY = height, maxX = 0, maxY = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 128) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  const bw = maxX - minX + 1
  const bh = maxY - minY + 1

  // 2) desenha centralizada e proporcional dentro do quadrado N x N
  const box = N * FILL
  const k = Math.min(box / bw, box / bh)
  const canvas = document.createElement('canvas')
  canvas.width = N
  canvas.height = N
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(probe, minX, minY, bw, bh, (N - bw * k) / 2, (N - bh * k) / 2, bw * k, bh * k)
  const px = ctx.getImageData(0, 0, N, N).data

  const inside = new Uint8Array(N * N)
  for (let i = 0; i < N * N; i++) inside[i] = px[i * 4 + 3] > 128 ? 1 : 0

  const dOut = distanceTo(inside, 1) // fora: distância até a letra
  const dIn = distanceTo(inside, 0) // dentro: distância até o fora
  const out = new Float32Array(N * N)
  for (let i = 0; i < N * N; i++) {
    out[i] = inside[i] ? -(dIn[i] - 0.5) : dOut[i] - 0.5
  }

  // Suaviza o campo (desfocar o campo de distância arredonda a "escadinha" do
  // contorno sem borrar a letra): 2 passadas de média móvel separável.
  const R = 3
  const tmp = new Float32Array(N * N)
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        let sum = 0
        for (let k2 = -R; k2 <= R; k2++) sum += out[y * N + Math.min(N - 1, Math.max(0, x + k2))]
        tmp[y * N + x] = sum / (2 * R + 1)
      }
    }
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        let sum = 0
        for (let k2 = -R; k2 <= R; k2++) sum += tmp[Math.min(N - 1, Math.max(0, y + k2)) * N + x]
        out[y * N + x] = sum / (2 * R + 1)
      }
    }
  }

  for (let i = 0; i < N * N; i++) out[i] /= N // unidades do campo (1 = largura da textura)
  return out
}

export default function MorphLetter({ scale, color = [0.184, 0.42, 1], fallback = null }) {
  const canvasRef = useRef(null)
  const scaleRef = useRef(scale)
  scaleRef.current = scale
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl2', { premultipliedAlpha: true, alpha: true })
    if (!gl) {
      setFailed(true)
      return
    }

    let raf = 0
    let alive = true

    const compile = (type, src) => {
      const sh = gl.createShader(type)
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh))
        return null
      }
      return sh
    }
    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) {
      setFailed(true)
      return
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.useProgram(prog)
    const u = (name) => gl.getUniformLocation(prog, name)
    const loc = {
      res: u('uRes'),
      scale: u('uScale'),
      w: u('uW'),
      color: u('uColor'),
    }
    gl.uniform3f(loc.color, color[0], color[1], color[2])
    gl.uniform1i(u('uTex'), 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, w, h)
      gl.uniform2f(loc.res, w, h)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const start = performance.now()
    let ready = false

    const frame = () => {
      if (!alive) return
      raf = requestAnimationFrame(frame)
      if (!ready) return

      const t = ((performance.now() - start) / 1000) % LOOP
      const w = [0, 0, 0, 0]

      // de cada letra pra seguinte (e da última de volta pra primeira)
      w[0] = 1
      for (let i = 0; i < MORPHS.length; i++) {
        const [a, b] = MORPHS[i]
        if (t >= a) {
          const m = smoother((t - a) / (b - a))
          w[i] = 1 - m
          w[(i + 1) % 4] = m
          if (t >= b) {
            w[i] = 0
            w[(i + 1) % 4] = 1
          }
        }
      }

      gl.uniform4f(loc.w, w[0], w[1], w[2], w[3])
      const s = scaleRef.current
      gl.uniform1f(loc.scale, typeof s?.get === 'function' ? s.get() : s || 1)

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(frame)

    Promise.all(SHAPES.map(loadImage))
      .then((imgs) => {
        if (!alive) return
        const sdfs = imgs.map(buildSdf)
        // 4 campos nos canais RGBA, em ponto flutuante (sem a "escadinha" dos 8 bits)
        const bytes = new Float32Array(N * N * 4)
        for (let c = 0; c < 4; c++) {
          const sdf = sdfs[Math.min(c, sdfs.length - 1)]
          for (let i = 0; i < N * N; i++) bytes[i * 4 + c] = sdf[i]
        }
        const tex = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, tex)
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, N, N, 0, gl.RGBA, gl.FLOAT, bytes)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        ready = true
      })
      .catch((error) => {
        console.error('MorphLetter: falha ao carregar as letras', error)
        if (alive) setFailed(true)
      })

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (failed) return fallback
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
}
