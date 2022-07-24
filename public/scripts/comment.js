const commentField = document.getElementById('comment-field');
const commentBtn = commentField.nextElementSibling;
const comment = document.getElementsByClassName('comment');
const comments = document.getElementById('comments');

const field = (field, btn) => {
    field.addEventListener('keyup', () => {
        if (field.value.length > 0) {
            btn.classList.remove('disabled');
        } else {
            btn.classList.add('disabled');
        }
    });
};

const getMoment = (time) => {
    const str = moment(time).fromNow();
    return str.charAt(0).toUpperCase() + str.slice(1);
};

field(commentField, commentBtn);

commentBtn.addEventListener('click', async () => {
    if (commentBtn.classList.contains('disabled')) {
        return;
    }
    const body = commentField.value;
    const headers = new Headers();
    headers.append('Accept', 'Application/JSON');
    headers.append('Content-Type', 'Application/JSON');
    const req = new Request(`/api/comments/${commentField.dataset.post}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            body,
        }),
        mode: 'cors',
    });
    try {
        const res = await fetch(req);
        const data = await res.json();
        if (!data.error) {
            commentField.value = '';
            commentBtn.classList.add('disabled');
            const comment = document.createElement('div');

            comment.innerHTML = `
            <div class="d-flex mb-3">
    <a href="/user/${data.user.username}">
        <img
            src="${data.user.profilePics}"
            alt="${data.user.name}"
            class="rounded-circle"
            style="height: 50px; width: 50px; object-fit: cover"
    /></a>
    <div class="w-100 ms-2 comment">
        <div class="p-2 border rounded-2 mb-2">
            <div class="d-flex justify-content-between mb-3">
                <div>
                    <a href="/user/${data.user.username}" class="post-title">
                        ${data.user.name}
                    </a>

                    <div>
                        <small class="text-muted"> ${
                            data.moment ? data.moment : 'A moment ago'
                        } </small>
                    </div>
                </div>
                
                <span class="small pointer text-primary reply"
                    ><i class="fas fa-reply me-2"></i>Reply</span
                >
                
            </div>

            <p class="card-text mt-2">${data.body}</p>
        </div>
        <div class="collapse">
            <textarea
                class="form-control ms-2 reply-field"
                rows="3"
                placeholder="Reply..."
                data-id="${data._id}"
            ></textarea>
            <button class="btn btn-primary ms-2 mt-2 disabled">
                <span class="fw-bold">Reply</span>
            </button>
            <button class="btn btn-outline-info fw-bold ms-2 dismiss">Dismiss</button>
        </div>
        
    </div>
</div>`;
            const comments = document.getElementById('comments');
            comments.appendChild(comment);
        }
    } catch (err) {
        console.log(err);
    }
});

[...comment].forEach((comment) => {
    const collapse = new mdb.Collapse(comment.querySelector('.collapse'), {
        parent: comments,
        toggle: false,
    });
    const replyBtn = comment.querySelector('.reply');
    const replyField = comment.querySelector('.reply-field');
    const submitBtn = replyField.nextElementSibling;
    field(replyField, submitBtn);
    replyBtn.addEventListener('click', (e) => {
        collapse.show();
        e.target.style.display = 'none';
    });
    comment.querySelector('.dismiss').addEventListener('click', (e) => {
        collapse.hide();
        replyBtn.style.display = 'block';
    });

    submitBtn.addEventListener('click', async (e) => {
        if (submitBtn.classList.contains('disabled')) {
            return;
        }
        const body = replyField.value;
        const headers = new Headers();
        headers.append('Accept', 'Application/JSON');
        headers.append('Content-Type', 'Application/JSON');
        const req = new Request(`/api/comments/replies/${replyField.dataset.id}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                body,
            }),
            mode: 'cors',
        });
        try {
            const res = await fetch(req);
            const data = await res.json();
            if (!data.error) {
                replyField.value = '';
                submitBtn.classList.add('disabled');
                const reply = document.createElement('div');
                reply.innerHTML = `
                <div class="d-flex mb-2">
    <a href="/user/${data.user.username}">
        <img src="${data.user.profilePics}" alt="${data.user.name}" class="rounded-circle"
            style="height: 50px; width: 50px: object-fit: cover;"></a>
    <div class="p-2 border rounded-2 ms-2 w-100">
        <div class="mb-2"><a href="/user/${data.user.name}" class="post-title">
        ${data.user.name}
            </a>

            <div>
                <small class="text-muted">
                ${getMoment(data.createdAt)}
                </small>
            </div>
        </div>
        <p class="card-text mt-2">
        ${data.body}
        </p>
    </div>

</div>`;
                comment.insertBefore(reply, comment.lastElementChild);
            }
        } catch (err) {
            console.log(err);
        }
    });
});


