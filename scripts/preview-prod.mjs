import { execSync, spawn } from 'node:child_process'

const PORT = Number(process.env.PREVIEW_PORT ?? 4173)

function listeningPids(port) {
  const pids = new Set()
  if (process.platform === 'win32') {
    const out = execSync('netstat -ano', { encoding: 'utf8' })
    for (const line of out.split('\n')) {
      if (!line.includes(`:${port}`) || !/LISTENING/i.test(line)) continue
      const pid = line.trim().split(/\s+/).pop()
      if (pid && pid !== '0') pids.add(pid)
    }
    return pids
  }

  try {
    const out = execSync(`lsof -ti tcp:${port} -sTCP:LISTEN`, {
      encoding: 'utf8',
    })
    for (const pid of out.split(/\s+/).filter(Boolean)) pids.add(pid)
  } catch {
    /* port free */
  }
  return pids
}

function freePort(port) {
  const pids = listeningPids(port)
  for (const pid of pids) {
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' })
      } else {
        execSync(`kill -9 ${pid}`, { stdio: 'ignore' })
      }
      console.log(`Port ${port} libéré (pid ${pid}).`)
    } catch {
      /* already gone */
    }
  }
}

freePort(PORT)
freePort(PORT + 1)

const child = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['vite', 'preview', '--host', '--port', String(PORT), '--strictPort'],
  { stdio: 'inherit', shell: process.platform === 'win32' },
)

child.on('exit', (code) => {
  process.exit(code ?? 0)
})
