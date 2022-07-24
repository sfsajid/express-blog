const likeBtn = document.querySelector('.like');
const dislikeBtn = document.querySelector('.dislike');

likeBtn.addEventListener('click', async () => {
    const headers = new Headers();
    headers.append('Accept', 'Application/JSON');
    const req = new Request(`/api/likes/${likeBtn.dataset.post}`, {
        method: 'GET',
        headers,
        mode: 'cors',
    });
    try {
        const res = await fetch(req);
        const data = await res.json();

        const likes = data.totalLikes > 0 ? `<small>(${data.totalLikes})</small>` : '';
        const dislikes = data.totalDislikes > 0 ? `<small>(${data.totalDislikes})</small>` : '';
        if (data.liked) {
            likeBtn.innerHTML = `<i class="bi bi-hand-thumbs-up-fill"></i>${likes}`;
            dislikeBtn.innerHTML = `<i class="bi bi-hand-thumbs-down"></i>${dislikes}`;
        } else {
            likeBtn.innerHTML = `<i class="bi bi-hand-thumbs-up"></i>${likes}`;
            dislikeBtn.innerHTML = `<i class="bi bi-hand-thumbs-down-fill"></i>${dislikes}`;
        }
    } catch (err) {
        console.log(err);
    }
});

dislikeBtn.addEventListener('click', async () => {
    const headers = new Headers();
    headers.append('Accept', 'Application/JSON');
    const req = new Request(`/api/dislikes/${dislikeBtn.dataset.post}`, {
        method: 'GET',
        headers,
        mode: 'cors',
    });
    try {
        const res = await fetch(req);
        const data = await res.json();

        const likes = data.totalLikes > 0 ? `<small>(${data.totalLikes})</small>` : '';
        const dislikes = data.totalDislikes > 0 ? `<small>(${data.totalDislikes})</small>` : '';
        if (data.liked) {
            likeBtn.innerHTML = `<i class="bi bi-hand-thumbs-up-fill"></i>${likes}`;
            dislikeBtn.innerHTML = `<i class="bi bi-hand-thumbs-down"></i>${dislikes}`;
        } else {
            likeBtn.innerHTML = `<i class="bi bi-hand-thumbs-up"></i>${likes}`;
            dislikeBtn.innerHTML = `<i class="bi bi-hand-thumbs-down-fill"></i>${dislikes}`;
        }
    } catch (err) {
        console.log(err);
    }
});
