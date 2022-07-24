const bBtn = document.getElementsByClassName('bookmark');

[...bBtn].forEach((btn) => {
    btn.addEventListener('click', async (e) => {
        const headers = new Headers();
        headers.append('Accept', 'Application/JSON');
        const req = new Request(`/api/bookmarks/${btn.dataset.post}`, {
            method: 'GET',
            headers,
            mode: 'cors',
        });
        try {
            const res = await fetch(req);
            const data = await res.json();
            if (data.bookmark) {
                btn.innerHTML = `<i class="bi bi-bookmark-fill"></i>`;
            } else {
                btn.innerHTML = `<i class="bi bi-bookmark"></i>`;
            }
        } catch (err) {
            console.log(err);
        }
    });
});
