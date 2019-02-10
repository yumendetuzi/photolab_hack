CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
}

// TODO: query params для скриптов! на каждый чендж

// stats:
// closeScreen - закрыл экран (нажал 'back', может когда то еще)
// startScreen1 - первый экран с картинкой
// startScreen2 - первый экран с картинкой 2
// startScreen3 - первый экран с картинкой 3
// facesScreen - экран с лицами
// facePhoto - выбор фото на первом экране
// removefacePhoto - удалил фотку на первом экране
// crowdScreen - экран с фотками толпы
// crowdPhoto{} - тыкнул на пресет
// myCrowdPhoto - свою загрузил
// cookingScreen - экран с кнопкой mix
// mix - нажал кнопку микс
// resultScreen - экран результатов
// tryingToShare - нажал кнопку шаринга
// tryingToShareFromAlert - нажал пошарить из алерта
// iDontCare - отказался шарить
// shared - пошарил
// notShared - не пошарил

var CROWD_PHOTOS_LIST = [
    /*{
        url: 'https://ewedit.files.wordpress.com/2017/07/gettyimages-821100560_master.jpg',
        id: 1
    },
    {
        url: 'https://a.ltrbxd.com/resized/sm/upload/0d/vz/j0/cr/black-dynamite-1200-1200-675-675-crop-000000.jpg',
        id: 2
    },
    {
        url: 'https://img-fotki.yandex.ru/get/26/14124454.2d1/0_9e3bf_ed5ddce8_orig.jpg',
        id: 3
    },
    {
        url: 'https://i.ytimg.com/vi/z9mUFSexdlE/maxresdefault.jpg',
        id: 4
    },
    {
        url: 'https://cdn.shazoo.ru/216426_N1qt1Xm7x4_j4nzfdtozpiiwkljklia.png',
        id: 5
    },
    {
        url: 'https://imgflip.com/s/meme/Distracted-Boyfriend.jpg',
        id: 6
    },
    {
        url: 'https://gl-images.condecdn.net/image/7j0meyqERjZ/crop/1620/f/sex.jpg',
        id: 7
    },
    {
        url: 'https://www.vladtime.ru/uploads/posts/2018-07/1530443463_maxresdefault.jpg',
        id: 8
    },
    {
        url: 'https://pbs.twimg.com/media/DxGrh3JU8AAuND_.jpg',
        id: 9
    },
    {
        url: 'https://www.bellmedia.ca/wp-content/uploads/2019/01/582700_570948_3621x2400-1280x800.jpg',
        id: 10
    },
    {
        url: 'https://fsmedia.imgix.net/5a/ed/ef/b8/b0e9/472e/9793/2eacf1d02227/han-and-chewbacca.jpeg',
        id: 11
    },
    {
        url: 'https://staff-online.ru/wp-content/uploads/2016/12/gosti-shou.jpg',
        id: 12
    },*/

    /**
    NEW PHOTOS
    **/

    {
        url: location.origin + '/static/crowd/1.png',
        id: 13
    },
    {
        url: location.origin + '/static/crowd/2.png',
        id: 14
    },
    {
        url: location.origin + '/static/crowd/3.png',
        id: 15
    },
    {
        url: location.origin + '/static/crowd/4.png',
        id: 16
    },
    {
        url: location.origin + '/static/crowd/5.png',
        id: 17
    },
    {
        url: location.origin + '/static/crowd/6.png',
        id: 18
    },
    {
        url: location.origin + '/static/crowd/7.png',
        id: 19
    },
    {
        url: location.origin + '/static/crowd/8.png',
        id: 20
    },
    {
        url: location.origin + '/static/crowd/9.png',
        id: 21
    },
    {
        url: location.origin + '/static/crowd/10.png',
        id: 22
    },
    {
        url: location.origin + '/static/crowd/11.png',
        id: 23
    },
    {
        url: location.origin + '/static/crowd/12.png',
        id: 24
    },
    {
        url: location.origin + '/static/crowd/13.png',
        id: 25
    },
    {
        url: location.origin + '/static/crowd/14.png',
        id: 26
    },
    {
        url: location.origin + '/static/crowd/15.png',
        id: 27
    },
    {
        url: location.origin + '/static/crowd/16.png',
        id: 28
    },
    {
        url: location.origin + '/static/crowd/17.png',
        id: 29
    },
    {
        url: location.origin + '/static/crowd/18.png',
        id: 30
    }
]

var USE_TEST_SERVER = false
var COUNTRY_SHORT_NAME = (getParameterByName('country') || '').trim().toLowerCase()
var IS_USA = COUNTRY_SHORT_NAME === 'us' || COUNTRY_SHORT_NAME === 'um'
var IS_INDIA = COUNTRY_SHORT_NAME === 'in'

var LAST_DATA

var facePhotoId = 0
var mixId = 0
var facesPhotos = []
var crowdPhoto = createPhotoObject()
var resultWasShared = false
var crowdListGenerated = false

var showZoomTip = true
var shareBtn = document.getElementById('shareBtn')
var answerBtn = document.getElementById('answerBtn')
var mixBtn = document.getElementById('mixBtn')
var facesDiv = document.getElementById('facesDiv')
var progressSteps = document.getElementById('progressSteps')
var screensStack = []

function yaReachGoal(targetName) {
    if (isLocalTest()) {
        return
    }

    ym(52246906, 'reachGoal', targetName)
}

function createPhotoObject(data) {
    data = data || {}

    return {
        url: data.image_url || data.url || '',
        crop: data.crop || [0, 0, 1, 1],
        rotation: data.rotation || 0,
        flip: data.flip || 0,
        id: facePhotoId++
    }
}

function setVisible(elem, visible) {
    if (visible) {
        elem.classList.remove('geneHidden')
    } else {
        elem.classList.add('geneHidden')
    }
}

function updateSteps() {
    var screen = screensStack[screensStack.length - 1]
    setVisible(progressSteps, screen.step)
}

function pushScreen(id, destroyFunc) {
    screensStack.push({
        id: id,
        div: document.getElementById(id),
        step: document.getElementById(id + 'Step'),
        destroy: destroyFunc
    })

    // send screen reached
    yaReachGoal(id)

    var screen = screensStack[screensStack.length - 1]
    setVisible(screen.div, true)
    if (screen.step) {
        screen.step.classList.add('progress-steps__step--active')
    }

    updateSteps()
}

function popScreen(disableStat) {
    if (screensStack.length === 1) {
        return // cannot pop last screen
    }

    var screen = screensStack[screensStack.length - 1]
    setVisible(screen.div, false)
    if (screen.step) {
        screen.step.classList.remove('progress-steps__step--active')
    }
    if (screen.destroy) {
        screen.destroy()
    }
    screensStack.length = screensStack.length - 1

    if (!disableStat) {
        yaReachGoal('closeScreen')
    }

    updateSteps()
}

function resetScreens() {
    if (tryShowAlertThatResultWillBeLost(resetScreens)) {
        return
    }

    facesDiv.innerHTML = ''
    facesPhotos.forEach(function (photo) {
        if (photo.destroy) {
            photo.destroy()
        }
    })
    facesPhotos.length = 0
    crowdPhoto = createPhotoObject()
    updateFacesScreenUI()

    var list = document.querySelector('.crowdList')
    if (list) {
        list.scrollTo(0, 0)
    }

    while(screensStack.length > 1) {
        popScreen(true)
    }
}

function openStartScreen() {
    // TODO: check country, landing by country

    var screenNumber
    var imgName
    var rnd = Math.random()
    if (rnd > 0.66) {
        imgName = 'first-onboarding.png'
        screenNumber = 1
    } else if (rnd > 0.33) {
        imgName = 'trump-onboarding.png'
        screenNumber = 2
    } else {
        imgName = 'fox-onboarding.png'
        screenNumber = 3
    }

    var screenId = 'startScreen' + screenNumber

    var img = new Image()
    img.classList.add('onboardingImage')
    img.addEventListener('click', function () {
        openFacesScreen()
    })

    var screen = document.getElementById(screenId)
    if (screenNumber === 1) {
        img.addEventListener('load', function () {
            var content = document.createElement('div')
            content.classList.add('onboardingContent1')
            content.appendChild(img)

            var startBtn = document.createElement('div')
            startBtn.classList.add('geneBtn')
            startBtn.innerHTML = 'Start'
            startBtn.addEventListener('click', function () {
                openFacesScreen()
            })

            var startDiv = document.createElement('div')
            startDiv.classList.add('onboardingStart')
            startDiv.appendChild(startBtn)

            screen.appendChild(content)
            screen.appendChild(startDiv)
        })
    } else {
        screen.appendChild(img)
    }

    img.src = '/static/img/' + imgName

    pushScreen(screenId)
}

function openFacesScreen() {
    generateCrowdPhotosList()

    if (screensStack.length > 0) {
        setVisible(screensStack[0].div, false)
    }
    screensStack.length = 0
    updateFacesScreenUI()
    pushScreen('facesScreen')
}

function selectFacePhoto() {
    selectNativePhoto(function (photo) {
        pushFacePhoto(photo)
        updateFacesScreenUI()

        yaReachGoal('facePhoto')
    })
}

function selectCrowdPhoto() {
    selectNativePhoto(function (photo) {
        crowdPhoto = createPhotoObject(photo)

        openCookingScreen()

        yaReachGoal('myCrowdPhoto')
    })
}

function pushFacePhoto(photo) {
    facesPhotos.push(photo)

    var body = document.querySelector('#facesScreen .contentBody')

    var spinner = document.createElement('div')
    spinner.classList.add('geneSpinner')
    spinner.innerHTML = 'Loading...'

    // 58 header
    // 50 footer
    // 20 margin
    // 50 - na vsyakii
    var maxContainerHeight = window.innerHeight - 58 - 50 - 20 - 50
    maxContainerHeight = maxContainerHeight / 2

    var containerDiv = document.createElement('div')
    containerDiv.classList.add('facePhotoContainer')
    containerDiv.style.height = maxContainerHeight + 'px'
    containerDiv.appendChild(spinner)

    facesDiv.appendChild(containerDiv)

    var img = new Image()
    img.addEventListener('load', function () {
        var maxHeight = (body.getBoundingClientRect().height - 20) / 2
        var maxWidth = body.getBoundingClientRect().width
        var canvas = createCanvasFromImageAndTransforms(photo, img, containerDiv, maxWidth, maxHeight)

        setTimeout(function () {
            containerDiv.innerHTML = ''
            containerDiv.appendChild(canvas)
            setTimeout(function () {
                canvas.style.opacity = '1'
                
                var remove = document.createElement('div')
                remove.classList.add('facePhotoContainerRemove')
                remove.addEventListener('click', function () {
                    yaReachGoal('removefacePhoto')
                    facesPhotos = facesPhotos.filter(function (p) { return p.id !== photo.id })
                    facesDiv.removeChild(containerDiv)
                    updateFacesScreenUI()
                })
                containerDiv.appendChild(remove)
            }, 10)
        }, 200)
    })
    img.src = photo.url

    facesDiv.appendChild(containerDiv)
}

function updateFacesScreenUI() {
    var buttons = document.querySelector('#facesScreen .actionButtons')
    setVisible(buttons, facesPhotos.length > 0)

    var plus = document.querySelector('#facesScreen .genePlus')
    setVisible(plus, facesPhotos.length < 2)
}

function isLocalTest() {
    return location.host.indexOf('127.0.0.1') !== -1
}

function selectNativePhoto(onPhotoSelected) {
    if (isLocalTest()) {
        var url = Math.random() > 0.5
            ? 'https://s16.stc.all.kpcdn.net/share/i/12/10577981/inx960x640.jpg'
            : 'https://1.bp.blogspot.com/-9QM7ciGXRkQ/V1hsB-wNLBI/AAAAAAAAMoA/eYbSHs00PTAjrI4QAmvYAIGCUe1AuRAnwCLcB/s1600/bryan_cranston_0095.jpg'

        var photo = createPhotoObject({
            url: url/*,
            crop: [0, 0.4, 1, 0.9],
            rotation: 180*/
        })
        onPhotoSelected(photo)
        return
    }

    var callback = 'nativePhotoSelected'
    window[callback] = function (result) {
        var photos = result.photos
        var photo = photos[0]
        if (photo) {
            onPhotoSelected(createPhotoObject(photo))
        }
    }
    location.href = 'callback:nativePhotoSelect?func=' + callback
}

function openCrowdScreen() {
    pushScreen('crowdScreen')
}

function createCanvasFromImageAndTransforms(photo, img, container, maxWidth, maxHeight) {
    var sx = 0
    var sy = 0
    var sw = img.width
    var sh = img.height
    var wScale = 1
    var hScale = 1
    if (photo.crop && photo.crop.length === 4) {
        var tx = photo.crop[0]
        var ty = photo.crop[1]
        var bx = photo.crop[2]
        var by = photo.crop[3]

        wScale = bx - tx
        hScale = by - ty

        sx = img.width * tx
        sy = img.height * ty
        sw = img.width * (bx - tx)
        sh = img.height * (by - ty)
    }

    var imgWidth = img.width
    var imgHeight = img.height
    var width = img.width * wScale
    var height = img.height * hScale
    var switchSizes = photo.rotation === 90 || photo.rotation === 270
    if (switchSizes) {
        var a = width
        width = height
        height = a
    }

    var scale = width > maxWidth ? maxWidth / width : 1
    if (height * scale > maxHeight) {
        scale *= maxHeight / (height * scale)
    }

    height *= scale
    width *= scale
    imgWidth *= scale
    imgHeight *= scale

    var canvas = document.createElement('canvas')
    canvas.width = width * 2
    canvas.height = height * 2
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    var ctx = canvas.getContext('2d')
    var horisScale = 1
    var vertScale = 1
    if (photo.flip === 1 || photo.flip === 3) {
        vertScale = -1
    }
    if (photo.flip === 2 || photo.flip === 3) {
        horisScale = -1
    }

    ctx.setTransform(horisScale, 0, 0, vertScale, width, height)
    ctx.rotate(photo.rotation * Math.PI / 180)

    var sx = 0
    var sy = 0
    var sw = img.width
    var sh = img.height
    if (photo.crop && photo.crop.length === 4) {
        var tx = photo.crop[0]
        var ty = photo.crop[1]
        var bx = photo.crop[2]
        var by = photo.crop[3]

        wScale = bx - tx
        hScale = by - ty

        sx = img.width * tx
        sy = img.height * ty
        sw = img.width * (bx - tx)
        sh = img.height * (by - ty)
    }
    ctx.drawImage(img, sx, sy, sw, sh, -width, -height, width * 2, height * 2)

    container.style.width = width + 'px'
    container.style.height = height + 'px'

    return canvas
}

function openCookingScreen() {
    var cookingFaces = document.getElementById('cookingFaces')
    cookingFaces.innerHTML = ''

    var cookingCrowd = document.getElementById('cookingCrowd')
    cookingCrowd.innerHTML = ''

    var createPhotoWrapper = function (photo, img, container, maxWidth, maxHeight) {
        var imgContainer = document.createElement('div')
        imgContainer.classList.add('cookingPhotoContainer')

        var canvas = createCanvasFromImageAndTransforms(photo, img, imgContainer, maxWidth, maxHeight)
        imgContainer.appendChild(canvas)

        container.appendChild(imgContainer)
    }

    var processPhoto = function (photo) {
        var img = new Image()
        img.addEventListener('load', function () {
            var bRect = cookingFaces.getBoundingClientRect()
            var maxWidth = bRect.width
            if (facesPhotos.length > 1) {
                maxWidth = bRect.width * 0.45
            }
            var maxHeight = bRect.height
            createPhotoWrapper(photo, img, cookingFaces, maxWidth, maxHeight)
        })
        img.src = photo.url
    }

    for (var i = 0; i < facesPhotos.length; i++) {
        processPhoto(facesPhotos[i])
    }

    var crowdImage = new Image()
    crowdImage.addEventListener('load', function () {
        var bRect = cookingCrowd.getBoundingClientRect()
        var maxWidth = bRect.width
        var maxHeight = bRect.height
        createPhotoWrapper(crowdPhoto, crowdImage, cookingCrowd, maxWidth, maxHeight)
    })
    crowdImage.src = crowdPhoto.url

    pushScreen('cookingScreen', function () {
        mixBtn.classList.remove('loading')
        mixId++
    })
}

function mixSelectedPhotos() {
    if (mixBtn.classList.contains('loading')) {
        return
    }

    yaReachGoal('mix')

    mixId++

    var thisMixId = mixId

    mixBtn.classList.add('loading')

    var payload = {
        me: facesPhotos[0],
        friend: facesPhotos[1],
        crowd: crowdPhoto
    }

    var host = USE_TEST_SERVER ? 'http://192.168.88.8:8080' : 'http://gene.ws.pho.to'

    fetch(host + '/create_mix?data=' + JSON.stringify(payload))
    .then(function (resp) { return resp.json() })
    .then(function (data) {
        if (thisMixId !== mixId) {
            return
        }

        LAST_DATA = data

        if (data.error) {
            mixBtn.classList.remove('loading')

            if (data.reason === 'no_faces') {
                showAlert('Oops!', 'Seems like there are no faces on some of your photos. Please, check your photos.', [{
                    text: 'OK'
                }])
            } else {
                showAlert('Oops!', 'Seems like smth went wrong on our side. Please, try again. If problem persists, please, try another photos.', [{
                    text: 'Cancel',
                    passive: true
                }, {
                    text: 'Try again',
                    onClick: mixSelectedPhotos
                }])
            }
        } else {
            var img = new Image()
            img.addEventListener('load', function () {
                mixBtn.classList.remove('loading')
                openResultScreen(data, img)
            })
            img.src = data.url
        }
    })
    .catch(function (error) {
        if (thisMixId !== mixId) {
            return
        }

        mixBtn.classList.remove('loading')

        showAlert('Oops!', 'Seems like smth went wrong on our side. Please, try again.', [{
            text: 'Cancel',
            passive: true
        }, {
            text: 'Try again',
            onClick: mixSelectedPhotos
        }])
    })
}

function openResultScreen(data, imgObject) {
    var pinchZoom
    var destroyed = false

    var body = document.querySelector('#resultScreen .contentBody')
    body.innerHTML = ''

    var canvas = document.createElement('canvas')
    body.appendChild(canvas)

    var answerIsVisible = false
    var onAnswerClick = function () {
        answerIsVisible = !answerIsVisible
        if (answerIsVisible) {
            answerBtn.classList.add('answerIsVisible')
        } else {
            answerBtn.classList.remove('answerIsVisible')
        }
    }
    answerBtn.addEventListener('click', onAnswerClick)

    var onShareClick = function () {
        shareResult(data, 'tryingToShare')
    }
    shareBtn.addEventListener('click', onShareClick)

    var removeTipsFunc

    setTimeout(function () {
        if (destroyed) {
            return
        }

        pinchZoom = new PinchZoomCanvas({
            canvas: canvas,
            path: data.url,
            imgObject: imgObject,
            momentum: true,
            onZoom: function () {
                showZoomTip = false

                if (removeTipsFunc) {
                    removeTipsFunc()
                    removeTipsFunc = undefined
                }
            },
            onRender: function () {
                if (answerIsVisible && pinchZoom) {
                    var dx = pinchZoom.position.x
                    var dy = pinchZoom.position.y
                    var dw = pinchZoom.scale.x * pinchZoom.imgTexture.width
                    var dh = pinchZoom.scale.y * pinchZoom.imgTexture.height
                    pinchZoom.context.fillStyle = 'rgba(255, 255, 255, 0.6)'
                    pinchZoom.context.fillRect(dx, dy, dw, dh)

                    data.bboxs.forEach(function (bbox) {
                        var x = bbox[0]
                        var y = bbox[1]
                        var w = bbox[2] - x
                        var h = bbox[3] - y
                        var bdx = dx + x * pinchZoom.scale.x
                        var bdy = dy + y * pinchZoom.scale.y
                        var bdw = w * pinchZoom.scale.x
                        var bdh = h * pinchZoom.scale.y
                        pinchZoom.context.drawImage(pinchZoom.imgTexture, x, y, w, h, bdx, bdy, bdw, bdh)
                        pinchZoom.context.lineWidth = 2.5 * pinchZoom.scale.x
                        pinchZoom.context.strokeStyle = '#2a79ff'
                        pinchZoom.context.roundRect(bdx, bdy, bdw, bdh, 2 * pinchZoom.scale.x).stroke()
                    })
                }
            }
        })

        setTimeout(function () {
            canvas.style.opacity = '1'

            if (showZoomTip) {
                var arrowLeft = new Image()
                arrowLeft.classList.add('leftArrowTip')
                arrowLeft.src = '/static/img/arrow-long-left.svg'
                arrowLeft.style.bottom = (pinchZoom.initPosition.y / 2 - 14) + 'px'

                var arrowRight = new Image()
                arrowRight.classList.add('rightArrowTip')
                arrowRight.src = '/static/img/arrow-long-left.svg'
                arrowRight.style.top = (pinchZoom.initPosition.y / 2 - 13) + 'px'

                body.appendChild(arrowLeft)
                body.appendChild(arrowRight)

                removeTipsFunc = function () {
                    body.removeChild(arrowLeft)
                    body.removeChild(arrowRight)
                }
            }

            /*if (data.bboxs && data.bboxs.length && pinchZoom) {
                var bbox = data.bboxs[0]
                var x = bbox[0]
                var y = bbox[1]
                var w = bbox[2] - x
                var h = bbox[3] - y
                var cx = x + w / 2
                var cy = y + h / 2

                var touchX = pinchZoom.initialScale * cx / 2 + pinchZoom.initPosition.x / 2
                var touchY = pinchZoom.initialScale * cy / 2 + pinchZoom.initPosition.y / 2

                var dx = pinchZoom.initialScale * w / 2
                var dy = pinchZoom.initialScale * h / 2

                var icx = pinchZoom.imgTexture.width / 2
                var icy = pinchZoom.imgTexture.height / 2
                touchX += cx > icx ? dx : -dx
                touchY += cy > icy ? dy : -dy

                var counter = 0
                var animate = function () {
                    if (pinchZoom) {
                        pinchZoom.lastTouchTime  = null;
                        pinchZoom.lastTouchPageX = 0;
                        pinchZoom.zoom(3, touchX, touchY)
                        pinchZoom._destroyImpetus();
                        pinchZoom._createImpetus();
                        if (counter < 10) {
                            counter++
                            requestAnimationFrame(animate)
                        } else {
                            onAnswerClick()
                        }
                    }
                }

                setTimeout(function () {
                    requestAnimationFrame(animate)
                }, 200)
            }*/

        }, 100)
    }, 200)

    resultWasShared = false
    pushScreen('resultScreen', function () {
        LAST_DATA = undefined
        destroyed = true
        answerBtn.classList.remove('answerIsVisible')
        answerBtn.removeEventListener('click', onAnswerClick)
        shareBtn.removeEventListener('click', onShareClick)
        if (pinchZoom) {
            pinchZoom.destroy()
            pinchZoom = undefined
        }
    })
}

function shareResult(data, eventName) {
    var callbackName = 'nativeShareCallback'
    window[callbackName] = function (result) {
        if (result) {
            resultWasShared = true
            yaReachGoal('shared')
        } else {
            resultWasShared = false
            yaReachGoal('notShared')
        }
    }

    yaReachGoal(eventName)

    var title = data.title || 'Find yourself in the crowd!'
    var description = '#secretsout challenge'

    var link = 'callback:nativeShare?og_image=' + encodeURIComponent(data.url) +
        '&og_title=' + encodeURIComponent(title) +
        '&og_description=' + encodeURIComponent(description) + 
        '&func=' + callbackName
    location.href = link
}

function backFromResult() {
    if (tryShowAlertThatResultWillBeLost(backFromResult)) {
        return
    }

    popScreen()
    popScreen()
}

function tryShowAlertThatResultWillBeLost(callback) {
    if (resultWasShared) {
        return false
    }

    if (!LAST_DATA) {
        return false
    }

    var title = 'Attention!'
    var description = 'Current mix will be lost. Wanna save it on your facebook?'

    showAlert(title, description, [{
        text: "I don't care",
        passive: true,
        onClick: function () {
            resultWasShared = true
            callback()
            yaReachGoal('iDontCare')
        }
    }, {
        text: 'Share',
        onClick: function () {
            shareResult(data, 'tryingToShareFromAlert')
        }
    }])

    return true
}

function safeExec(callback, defaultValue) {
    try {
        return callback()
    } catch(e) {
        return defaultValue
    }
}

function showAlert(title, description, buttons) {
    var closeAlert
    var titleDiv = document.createElement('div')
    titleDiv.classList.add('geneAlertTitle')
    titleDiv.innerHTML = title

    var descriptionDiv = document.createElement('div')
    descriptionDiv.classList.add('geneAlertDescription')
    descriptionDiv.innerHTML = description

    var closeAlert = function () {
        overlay.style.opacity = '0'
        setTimeout(function () {
            document.body.removeChild(overlay)
        }, 100)
    }

    var buttonsDiv = document.createElement('div')
    buttonsDiv.classList.add('geneAlertButtons')
    buttons.forEach(function (button) {
        var btnDiv = document.createElement('div')
        btnDiv.classList.add('geneBtn')
        if (button.passive) {
            btnDiv.classList.add('bordered')
        }
        btnDiv.innerHTML = button.text
        btnDiv.addEventListener('click', function (e) {
            e.stopPropagation()

            if (button.onClick) {
                button.onClick()
            }
            if (closeAlert) {
                closeAlert()
            }
        })
        buttonsDiv.appendChild(btnDiv)
    })

    var box = document.createElement('div')
    box.classList.add('geneAlert')
    box.appendChild(titleDiv)
    box.appendChild(descriptionDiv)
    box.appendChild(buttonsDiv)

    var overlay = document.createElement('div')
    overlay.classList.add('geneOverlay')
    overlay.appendChild(box)
    document.body.appendChild(overlay)

    closeAlert = function () {
        overlay.style.opacity = '0'
        setTimeout(function () {
            document.body.removeChild(overlay)
        }, 100)
    }
    overlay.addEventListener('click', closeAlert)

    setTimeout(function () {
        overlay.style.opacity = '1'
    }, 10)
}

function generateCrowdPhotosList() {
    if (crowdListGenerated) {
        return
    }

    crowdListGenerated = true

    var crowdList = document.querySelector('.crowdList')
    CROWD_PHOTOS_LIST.forEach(function (photo) {
        var img = new Image()
        img.src = photo.url
        img.addEventListener('click', function () {
            crowdPhoto = createPhotoObject({
                url: photo.url
            })
            yaReachGoal('crowdPhoto' + photo.id)
            openCookingScreen()
        })

        crowdList.appendChild(img)
    })
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
    var results = regex.exec(location.search)
    return results === null ? '' : decodeURIComponent(results[1])
}

openStartScreen()
