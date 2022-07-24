const cImage = document.getElementById('cropped-image');
const myModal = document.getElementById('crop-modal');
const cModal = new mdb.Modal(myModal);
const profilePic = document.getElementById('profilePicsFile');
const uploadBtn = document.getElementById('upload');
const resetBtn = document.getElementById('resetProfilePics');
const pImages = document.getElementsByClassName('img-profile');

window.onload = () => {
    let imgUrl = '';
    const baseCropping = new Croppie(cImage, {
        viewport: {
            width: 200,
            height: 200,
        },
        boundary: {
            width: 300,
            height: 300,
        },
        showZoomer: true,
    });

    const readableFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            imgUrl = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    myModal.addEventListener('shown.mdb.modal', async () => {
        await baseCropping.bind({
            url: imgUrl,
        });
    });

    profilePic.addEventListener('change', () => {
        cModal.show();
        if (profilePic.files && profilePic.files[0]) {
            readableFile(profilePic.files[0]);
        }
    });

    uploadBtn.addEventListener('click', async () => {
        try {
            const blobData = await baseCropping.result('blob');
            const formData = new FormData();
            const file = profilePic.files[0];
            const name = generateFileName(file.name);
            formData.append('profilePics', blobData, name);
            const headers = new Headers();
            headers.append('Accept', 'Application/JSON');
            const req = new Request('/uploads/profilePics', {
                method: 'POST',
                headers,
                mode: 'cors',
                body: formData,
            });
            const res = await fetch(req);
            const data = await res.json();
            if (data) {
                for (let i = 0; i < pImages.length; i++) {
                    const el = pImages[i];
                    el.src = data.profilePics;
                }
                resetBtn.classList.remove('d-none');
                setTimeout(() => {
                    cModal.hide();
                }, 500);
            }
        } catch (err) {
            console.log(err);
        }
    });

    resetBtn.addEventListener('click', async () => {
        try {
            const req = new Request('/uploads/profilePics', {
                method: 'DELETE',
                mode: 'cors',
            });
            const res = await fetch(req);
            const data = await res.json();
            if (data) {
                for (let i = 0; i < pImages.length; i++) {
                    const el = pImages[i];
                    el.src = data.profilePics;
                }
                resetBtn.classList.add('d-none');
            }
        } catch (err) {
            console.log(err);
        }
    });
};

const generateFileName = (name) => {
    const types = /(.jpeg|.jpg|.png|.gif)/;
    return name.replace(types, '.png');
};
