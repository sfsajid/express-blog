const uploadBtn = document.getElementById('thumbPhoto');
const resetBtn = document.getElementById('resetThumb');
const thumbPhoto = document.getElementById('thumbnail');
const thumbInput = document.getElementById('post-thumbnail');
const galleryBtn = document.getElementById('galleryBtn');
const galleryDiv = document.getElementById('gallery-div');
const postUrl = document.getElementById('posturl');
const postTitle = document.getElementById('title');
const urlBtn = document.getElementById('urlbtn');
const galleryModal = new mdb.Modal(document.getElementById('gallery'));

thumbPhoto.src = thumbInput.value;

document.getElementById(
    'mainhost'
).innerText = `${window.location.protocol}//${window.location.host}/posts/`;

urlBtn.addEventListener('click', () => {
    const value = postTitle.value;
    postUrl.value = value
        .toLowerCase()
        .replace(/[^a-z\d\s\\-]/gi, '')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .join('-');
});

postUrl.addEventListener('keyup', async () => {
    const valid = (main) => {
        let parent = main.parentElement;
        let siblings = parent.children;
        for (let i = 0; i < siblings.length - 1; i++) {
            siblings[i].style.border = '1px solid #00B74A';
        }
        main.classList.remove('is-invalid');
        main.classList.add('is-valid');
        parent.lastElementChild.classList.add('valid-feedback');
        parent.lastElementChild.classList.remove('invalid-feedback');
        parent.lastElementChild.innerText = 'URL is available';
    };

    const invalid = (main, message) => {
        let parent = main.parentElement;
        let siblings = parent.children;
        for (let i = 0; i < siblings.length - 1; i++) {
            siblings[i].style.border = '1px solid #F93154';
        }
        main.classList.remove('is-valid');
        main.classList.add('is-invalid');
        parent.lastElementChild.classList.add('invalid-feedback');
        parent.lastElementChild.classList.remove('valid-feedback');
        parent.lastElementChild.innerText = message;
    };

    postUrl.value = postUrl.value
        .toLowerCase()
        .replace(/[^a-z\d\s\\-]/gi, '')
        .replace(/\s+/g, '-')
        .trim();
    const regex = /^[^\w\d]+|[^a-z\d]+$/gi;
    if (regex.test(postUrl.value)) {
        return invalid(postUrl, 'Please enter a valid URL');
    }

    if (postUrl.value.length >= 5) {
        const headers = new Headers();
        headers.append('Accept', 'Application/JSON');
        const req = new Request(`/api/checkurl?url=${postUrl.value}`, {
            method: 'GET',
            headers,
            mode: 'cors',
        });
        const res = await fetch(req);
        const data = await res.json();
        if (data.error) {
            return invalid(postUrl, data.error);
        }
        if (data.url) {
            valid(postUrl);
        } else {
            if (data.id) {
                const isOld = document.getElementById(`postId`).value === data.id;
                if (isOld) {
                    return valid(postUrl);
                }
                return invalid(postUrl, 'URL is not available');
            }
            return invalid(postUrl, 'URL is not available');
        }
    } else {
        invalid(postUrl, 'URL needs to be at least 5 characters');
    }
});

const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('post-thumbnail', file);
    const headers = new Headers();
    headers.append('Accept', 'Application/JSON');
    const req = new Request('/uploads/thumbnail', {
        method: 'POST',
        headers,
        mode: 'cors',
        body: formData,
    });
    const res = await fetch(req);
    const data = await res.json();
    thumbInput.value = data.link;
    thumbPhoto.src = data.link;
};

resetBtn.addEventListener('click', () => {
    uploadBtn.form.reset();
    thumbInput.value = '/images/thumbnail.jpg';
    thumbPhoto.src = '/images/thumbnail.jpg';
});

uploadBtn.addEventListener('change', (e) => {
    if (uploadBtn.files && uploadBtn.files[0]) {
        uploadImage(uploadBtn.files[0]);
    }
});

galleryBtn.addEventListener('click', async () => {
    const res = await fetch('/uploads/getimage');
    const data = await res.json();
    let elements = 'Loading...';
    if (data) {
        elements = '';
        data.forEach((el) => {
            elements += `<div class="col-6 col-md-4 col-lg-3 my-auto image-gallery"><img src="${el.url}" alt="gallery-image">
            <button class="btn-plus" onclick="btnPlus('${el.url}')"><i class="bi bi-plus-circle-fill"></i></button>
        </div>`;
        });
    }
    galleryDiv.innerHTML = elements;
    galleryModal.show();
});

const btnPlus = (url) => {
    thumbInput.value = url;
    thumbPhoto.src = url;
    galleryModal.hide();
};
