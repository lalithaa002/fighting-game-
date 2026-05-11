const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.7

// Red splash effect
function showHitEffect(x, y) {
    const particles = []
    for (let i = 0; i < 15; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            alpha: 1,
            radius: Math.random() * 8 + 2
        })
    }

    function drawParticles() {
        particles.forEach((p, index) => {
            p.x += p.vx
            p.y += p.vy
            p.alpha -= 0.05
            if (p.alpha <= 0) {
                particles.splice(index, 1)
                return
            }
            c.save()
            c.globalAlpha = p.alpha
            c.beginPath()
            c.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
            c.fillStyle = 'red'
            c.fill()
            c.restore()
        })
        if (particles.length > 0) requestAnimationFrame(drawParticles)
    }
    drawParticles()
}

// Level message ತೋರಿಸು
function showLevelMessage(msg, callback) {
    const displayText = document.querySelector('#displayText')
    displayText.innerHTML = msg
    displayText.style.display = 'flex'
    setTimeout(() => {
        displayText.style.display = 'none'
        if (callback) callback()
    }, 2500)
}

const background = new Sprite({
    position: { x: 0, y: 0 },
    imageSrc: './img/background.png'
})

const player = new Fighter({
    position: { x: 100, y: 0 },
    velocity: { x: 0, y: 0 },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: { x: 215, y: 157 },
    sprites: {
        idle:    { imageSrc: './img/samuraiMack/Idle.png',     framesMax: 8 },
        run:     { imageSrc: './img/samuraiMack/Run.png',      framesMax: 8 },
        jump:    { imageSrc: './img/samuraiMack/Jump.png',     framesMax: 2 },
        fall:    { imageSrc: './img/samuraiMack/Fall.png',     framesMax: 2 },
        attack1: { imageSrc: './img/samuraiMack/Attack1.png',  framesMax: 6 },
        takeHit: { imageSrc: './img/samuraiMack/Take Hit.png', framesMax: 4 },
        death:   { imageSrc: './img/samuraiMack/Death.png',    framesMax: 6 },
    },
    attackBox: { offset: { x: 100, y: 50 }, width: 160, height: 50 }
})

// Enemy 1 - Kenji
const enemy = new Fighter({
    position: { x: 800, y: 0 },
    velocity: { x: 0, y: 0 },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: { x: 215, y: 157 },
    sprites: {
        idle:    { imageSrc: './img/kenji/Idle.png',     framesMax: 4 },
        run:     { imageSrc: './img/kenji/Run.png',      framesMax: 8 },
        jump:    { imageSrc: './img/kenji/Jump.png',     framesMax: 2 },
        fall:    { imageSrc: './img/kenji/Fall.png',     framesMax: 2 },
        attack1: { imageSrc: './img/kenji/Attack1.png',  framesMax: 4 },
        takeHit: { imageSrc: './img/kenji/Take hit.png', framesMax: 3 },
        death:   { imageSrc: './img/kenji/Death.png',    framesMax: 7 },
    },
    attackBox: { offset: { x: -170, y: 50 }, width: 160, height: 50 }
})

// Enemy 2 - Brute
const enemy2 = new Fighter({
    position: { x: 800, y: 0 },
    velocity: { x: 0, y: 0 },
    imageSrc: './img/brute/brute1.png',
    framesMax: 7,
    scale: 2.5,
    offset: { x: 215, y: 157 },
    sprites: {
        idle:    { imageSrc: './img/brute/brute1 .png', framesMax: 7 },
        run:     { imageSrc: './img/brute/brute2.png', framesMax: 8 },
        jump:    { imageSrc: './img/brute/brute3.png', framesMax: 8 },
        fall:    { imageSrc: './img/brute/brute3.png', framesMax: 8 },
        attack1: { imageSrc: './img/brute/brute3 .png', framesMax: 4 },
        takeHit: { imageSrc: './img/brute/brute4.png', framesMax: 6 },
        death:   { imageSrc: './img/brute/brute2.png', framesMax: 6 },
    },
    attackBox: { offset: { x: -170, y: 50 }, width: 160, height: 50 }
})

let currentEnemy = enemy
let level = 1
let gameOver = false

const keys = {
    a: { pressed: false },
    d: { pressed: false },
    w: { pressed: false },
}

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            case 'd': keys.d.pressed = true; player.lastKey = 'd'; break;
            case 'a': keys.a.pressed = true; player.lastKey = 'a'; break;
            case 'w': player.velocity.y = -20; break;
            case ' ': player.attack(); break;
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd': keys.d.pressed = false; break;
        case 'a': keys.a.pressed = false; break;
    }
})

// Level 2 start
function startLevel2() {
    gameOver = false
    currentEnemy = enemy2

    player.health = 100
    player.dead = false
    player.position = { x: 100, y: 0 }
    player.velocity = { x: 0, y: 0 }
    player.image = player.sprites.idle.image
    player.framesMax = player.sprites.idle.framesMax
    player.framesCurrent = 0
    document.querySelector('#playerHealth').style.width = '100%'

    enemy2.health = 100
    enemy2.dead = false
    enemy2.position = { x: 800, y: 0 }
    enemy2.velocity = { x: 0, y: 0 }
    enemy2.image = enemy2.sprites.idle.image
    enemy2.framesMax = enemy2.sprites.idle.framesMax
    enemy2.framesCurrent = 0
    document.querySelector('#enemyHealth').style.width = '100%'

    clearTimeout(timerId)
    decreaseTimer(30)
}

let timerId
decreaseTimer(10)

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    background.update()

    // Player movement
    player.velocity.x = 0
    if (!player.dead) {
        if (keys.a.pressed && player.lastKey === 'a') {
            player.velocity.x = -5
            player.switchSprite('run')
        } else if (keys.d.pressed && player.lastKey === 'd') {
            player.velocity.x = 5
            player.switchSprite('run')
        } else {
            player.switchSprite('idle')
        }
        if (player.velocity.y < 0) player.switchSprite('jump')
        else if (player.velocity.y > 0) player.switchSprite('fall')
    }

    // Enemy AI
    currentEnemy.velocity.x = 0
    if (!player.dead && !currentEnemy.dead) {
        if (currentEnemy.position.x > player.position.x + 150) {
            currentEnemy.velocity.x = -3
            currentEnemy.switchSprite('run')
        } else if (currentEnemy.position.x < player.position.x - 150) {
            currentEnemy.velocity.x = 3
            currentEnemy.switchSprite('run')
        } else {
            currentEnemy.switchSprite('idle')
        }

        if (player.velocity.y < -10) {
            currentEnemy.velocity.y = -20
        }

        const distanceBetween = Math.abs(currentEnemy.position.x - player.position.x)
        if (distanceBetween < 200 && !currentEnemy.isAttacking) {
            if (Math.random() < 0.02) {
                currentEnemy.attack()
            }
        }
    } else {
        currentEnemy.switchSprite('idle')
    }

    if (currentEnemy.velocity.y < 0) currentEnemy.switchSprite('jump')
    else if (currentEnemy.velocity.y > 0) currentEnemy.switchSprite('fall')

    player.update()
    currentEnemy.update()

    // Collision - player attacks enemy
    if (
        rectangularCollision({ rectangle1: player, rectangle2: currentEnemy }) &&
        player.isAttacking &&
        player.framesCurrent === 4
    ) {
        player.isAttacking = false
        currentEnemy.takeHit()
        document.querySelector('#enemyHealth').style.width = currentEnemy.health + '%'
        showHitEffect(
            currentEnemy.position.x + currentEnemy.width / 2,
            currentEnemy.position.y + currentEnemy.height / 2
        )
    }
    if (player.isAttacking && player.framesCurrent === player.framesMax - 1)
        player.isAttacking = false

    // Collision - enemy attacks player
    if (
        rectangularCollision({ rectangle1: currentEnemy, rectangle2: player }) &&
        currentEnemy.isAttacking &&
        currentEnemy.framesCurrent === 2
    ) {
        currentEnemy.isAttacking = false
        player.takeHit()
        document.querySelector('#playerHealth').style.width = player.health + '%'
        showHitEffect(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2
        )
    }
    if (currentEnemy.isAttacking && currentEnemy.framesCurrent === currentEnemy.framesMax - 1)
        currentEnemy.isAttacking = false

    // Game over check
    if (!gameOver) {
        if (currentEnemy.health <= 0 || player.health <= 0) {
            if (level === 1 && currentEnemy.health <= 0) {
                gameOver = true
                level = 2
                showLevelMessage('💀 A New Evil Rises!', startLevel2)
            } else {
                gameOver = true
                determineWinner({ player, enemy: currentEnemy })
            }
        }
    }
}

animate()