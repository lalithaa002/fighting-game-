const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.7

// Background scrolling state
let bgX = 0
const bgSpeed = 0.5  // how fast background scrolls (0.5 = half player speed for parallax)

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
            if (p.alpha <= 0) { particles.splice(index, 1); return }
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

function showLevelMessage(msg, callback) {
    const displayText = document.querySelector('#displayText')
    displayText.innerHTML = msg
    displayText.style.display = 'flex'
    setTimeout(() => {
        displayText.style.display = 'none'
        if (callback) callback()
    }, 2500)
}

// Draw looping background manually (replaces background.update())
function drawScrollingBackground(img, scrollX, scale = 1) {
    const imgW = img.width * scale
    const imgH = img.height * scale
    // Normalize offset so it loops seamlessly
    const offset = ((scrollX * bgSpeed) % imgW + imgW) % imgW
    // Draw two copies side by side to fill the seam
    c.drawImage(img, -offset, 0, imgW, imgH)
    c.drawImage(img, imgW - offset, 0, imgW, imgH)
}

const backgroundImg = new Image()
backgroundImg.src = './img/background.png'

const shopImg = new Image()
shopImg.src = './img/shop.png'

// Shop animation state
let shopFrame = 0
let shopFramesElapsed = 0
const shopFramesMax = 6
const shopFramesHold = 5
const shopScale = 2.5

function drawShop(scrollX) {
    // Shop scrolls at same rate as background for consistency
    const bgW = backgroundImg.width   // natural bg width
    const shopFrameW = shopImg.width / shopFramesMax
    const shopFrameH = shopImg.height
    const shopDrawW = shopFrameW * shopScale
    const shopDrawH = shopFrameH * shopScale

    // Fixed position relative to the looping background
    const shopBgX = 600   // where on the background the shop lives
    const shopY = 128

    const bgOffset = ((scrollX * bgSpeed) % bgW + bgW) % bgW

    // Draw shop at its looping position (two copies like the background)
    const drawX = shopBgX - bgOffset
    c.drawImage(shopImg, shopFrame * shopFrameW, 0, shopFrameW, shopFrameH, drawX, shopY, shopDrawW, shopDrawH)
    // Second copy for seamless loop
    c.drawImage(shopImg, shopFrame * shopFrameW, 0, shopFrameW, shopFrameH, drawX + bgW, shopY, shopDrawW, shopDrawH)

    // Animate shop frames
    shopFramesElapsed++
    if (shopFramesElapsed % shopFramesHold === 0) {
        shopFrame = shopFrame < shopFramesMax - 1 ? shopFrame + 1 : 0
    }
}

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

// Kenji - Wave 1
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

function makeKenji(x) {
    return new Fighter({
        position: { x, y: 0 },
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
}

// Kenji clone for Wave 2
const enemy2 = makeKenji(800)

let wave = 1
let gameOver = false
let timerId
let wave3Enemies = []

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

function resetPlayer() {
    player.health = 100
    player.dead = false
    player.isAttacking = false
    player.position = { x: 100, y: 0 }
    player.velocity = { x: 0, y: 0 }
    player.image = player.sprites.idle.image
    player.framesMax = player.sprites.idle.framesMax
    player.framesCurrent = 0
    document.querySelector('#playerHealth').style.width = '100%'
}

function resetFighter(fighter, startX) {
    fighter.health = 100
    fighter.dead = false
    fighter.isAttacking = false
    fighter.position = { x: startX, y: 0 }
    fighter.velocity = { x: 0, y: 0 }
    fighter.image = fighter.sprites.idle.image
    fighter.framesMax = fighter.sprites.idle.framesMax
    fighter.framesCurrent = 0
}

function startWave2() {
    wave = 2
    gameOver = false
    wave3Enemies = []
    resetPlayer()
    resetFighter(enemy2, 800)
    document.querySelector('#enemyHealth').style.width = '100%'
    clearTimeout(timerId)
    decreaseTimer(30)
}

function startWave3() {
    wave = 3
    gameOver = false
    resetPlayer()
    wave3Enemies = [makeKenji(850), makeKenji(600)]
    document.querySelector('#enemyHealth').style.width = '100%'
    clearTimeout(timerId)
    decreaseTimer(40)
}

function updateEnemyHealthBar() {
    const avgHealth = wave3Enemies.reduce((sum, e) => sum + Math.max(e.health, 0), 0) / wave3Enemies.length
    document.querySelector('#enemyHealth').style.width = avgHealth + '%'
}

function handleEnemyAI(currentEnemy) {
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
        if (player.velocity.y < -10) currentEnemy.velocity.y = -20
        const dist = Math.abs(currentEnemy.position.x - player.position.x)
        const attackChance = wave === 3 ? 0.04 : 0.02
        if (dist < 200 && !currentEnemy.isAttacking) {
            if (Math.random() < attackChance) currentEnemy.attack()
        }
    } else if (!currentEnemy.dead) {
        currentEnemy.switchSprite('idle')
    }
    if (currentEnemy.velocity.y < 0) currentEnemy.switchSprite('jump')
    else if (currentEnemy.velocity.y > 0) currentEnemy.switchSprite('fall')
}

function handleCollision(currentEnemy) {
    if (currentEnemy.dead) return

    if (
        rectangularCollision({ rectangle1: player, rectangle2: currentEnemy }) &&
        player.isAttacking &&
        player.framesCurrent === 4
    ) {
        player.isAttacking = false
        currentEnemy.takeHit()
        if (wave !== 3) {
            document.querySelector('#enemyHealth').style.width = currentEnemy.health + '%'
        }
        showHitEffect(
            currentEnemy.position.x + currentEnemy.width / 2,
            currentEnemy.position.y + currentEnemy.height / 2
        )
    }

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
}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    // Scroll background based on player horizontal movement
    if (!player.dead) {
        if (keys.a.pressed && player.lastKey === 'a') bgX -= 5
        else if (keys.d.pressed && player.lastKey === 'd') bgX += 5
    }

    drawScrollingBackground(backgroundImg, bgX)
    drawShop(bgX)

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

    if (wave === 1 || wave === 2) {
        const currentEnemy = wave === 1 ? enemy : enemy2
        handleEnemyAI(currentEnemy)
        player.update()
        currentEnemy.update()
        handleCollision(currentEnemy)
        if (player.isAttacking && player.framesCurrent === player.framesMax - 1)
            player.isAttacking = false

        if (!gameOver) {
            if (player.health <= 0) {
                gameOver = true
                determineWinner({ player, enemy: currentEnemy })
            } else if (currentEnemy.health <= 0) {
                gameOver = true
                if (wave === 1) {
                    showLevelMessage('⚔️ Wave 1 Clear!<br>Kenji Returns — Stronger!', startWave2)
                } else {
                    showLevelMessage('💀 FINAL WAVE!<br>Two Kenjis Remain!', startWave3)
                }
            }
        }
    }

    if (wave === 3) {
        wave3Enemies.forEach(e => handleEnemyAI(e))
        player.update()
        wave3Enemies.forEach(e => e.update())
        wave3Enemies.forEach(e => handleCollision(e))
        if (player.isAttacking && player.framesCurrent === player.framesMax - 1)
            player.isAttacking = false

        updateEnemyHealthBar()

        if (!gameOver) {
            if (player.health <= 0) {
                gameOver = true
                determineWinner({ player, enemy: wave3Enemies[0] })
            } else if (wave3Enemies.every(e => e.health <= 0)) {
                gameOver = true
                clearTimeout(timerId)
                const displayText = document.querySelector('#displayText')
                displayText.innerHTML = '🏆 YOU WIN!<br>All Enemies Defeated!'
                displayText.style.display = 'flex'
            }
        }
    }
}

animate()
decreaseTimer(10)
