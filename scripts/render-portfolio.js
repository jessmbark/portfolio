const clipHolder = document.querySelector('#main-clips')

function addChildClassed(parent,newClass,tag='div') {
    var newDiv = document.createElement(tag);

    var classes = newClass.split(' ')
    for (var i=0; i<classes.length; i++) {
        newDiv.classList.add(classes[i]);
    }

    parent.appendChild(newDiv);
    return newDiv;
}

d3.json('portfolio.json')
    .then(data => {

        /* set the page title */
        document.title = data['homepage']['name'] + ' — Portfolio'

        /* set the photo */
        document.querySelector('#creator-photo').setAttribute('src',data['homepage']['photo'])

        /* set the name */
        document.querySelector('#creator-name').textContent = data['homepage']['name']

        /* populate socials */
        const socialContainer = document.querySelector('#creator-handle')

        socialContainer.textContent = data['homepage']['socials']['handle']
        var socials = data['homepage']['socials']['platforms']
        for (i in socials) {
            var platform = socials[i]
            console.log(platform)
            var platAnchor = addChildClassed(socialContainer,'social-icon',tag='a')
            platAnchor.setAttribute('href',platform['link'])
            platAnchor.textContent = ' '
            addChildClassed(platAnchor,platform['icon'],'i')
        }

        /* set the about block */
        const bioAbout = document.querySelector('#creator-bio')
        if (data['homepage']['bio']['format'] == 'rich') {
            bioAbout.innerHTML = data['homepage']['bio']['text']
        } else if (data['homepage']['bio']['format'] == 'plain') {
            bioAbout.textContent = data['homepage']['bio']['text']
        }

        /* add story tags to the top menu */
        const topMenu = document.querySelector('#top-menu')
        const clipTags = data['homepage']['menu']['tags']
        
        if (data['homepage']['menu']['include-all'] == 'TRUE') {
            var menuAll = addChildClassed(topMenu,'menu-item')
            menuAll.setAttribute('id','menu-item-all')
            menuAll.setAttribute('selected','true')
            menuAll.textContent = 'All'
        }

        for (var i=0; i<clipTags.length; i++) {
            var clipTag = clipTags[i]
            var newMenuItem = addChildClassed(topMenu,'menu-item')
            newMenuItem.setAttribute('selected','false')
            addChildClassed(newMenuItem,clipTag['icon'],'i')
            newMenuItem.innerHTML += ' ' + clipTag['text']
        }

        /* create the clips */
        data = data['clips']
        for (var i=0; i<data.length; i++) {
            var clipData = data[i];

            var newClip = addChildClassed(clipHolder,'clip')

            var imageCol = addChildClassed(newClip,'clip-image-column')
            imageCol.classList.add('column')
            var contentCol = addChildClassed(newClip,'clip-content-column')
            contentCol.classList.add('column')

            var clipImage = addChildClassed(imageCol,'clip-image','img')
            clipImage.setAttribute('src',clipData['image'])

            addChildClassed(contentCol,'clip-title','h2').textContent = clipData['title']

            var metadataElem = addChildClassed(contentCol,'clip-metadata','p')
            addChildClassed(metadataElem,'clip-date','a').textContent = clipData['date']
            metadataElem.textContent += ' | '
            addChildClassed(metadataElem,'clip-publication','a').textContent = clipData['publication']

            addChildClassed(contentCol,'clip-award','p').textContent = clipData['award']
            addChildClassed(contentCol,'clip-about','p').textContent = clipData['about']

            newClip.setAttribute('href',clipData['link'])
            newClip.setAttribute('type',clipData['type'])

            newClip.onclick = function() {
                window.open(this.getAttribute('href'),'_self')
            }
        }

        /* init the menu */
        var menuItems = document.querySelectorAll('.menu-item');
        console.log(menuItems)

        for (var i=0; i<menuItems.length; i++) {

            menuItems[i].onclick = function() {
                var clips = document.querySelectorAll('.clip')
                if (this.getAttribute('selected') == 'false') {
                    for (var j=0; j<menuItems.length; j++) {
                        menuItems[j].setAttribute('selected','false');
                    }
                    this.setAttribute('selected','true')

                    var clickedTag = this.textContent.trim();
                    if (clickedTag != 'All') {
                        console.log(clips[z])
                        for (var z=0; z<clips.length; z++) {
                            if (clips[z].getAttribute('type') != clickedTag) {
                                clips[z].style.display = 'none'
                            } else {
                                clips[z].style.display = 'block'
                            }
                        }
                    } else {
                        for (var z=0; z<clips.length; z++) {
                            clips[z].style.display = 'block'
                        }
                    }
                }
            }
        }
    })