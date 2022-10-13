async function commentFormHandler(event) {
  event.preventDefault();

  const commentBody = document.querySelector('.comment-body').value.trim();

  const postId = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
  ];

  if (commentBody) {
      const res = await fetch('/api/comment', {
          method: 'POST',
          body: JSON.stringify({
              postId,
              commentBody
          }),
          headers: {
              'Content-Type': 'application/json'
          }
      });

      if (res.ok) {
          document.location.reload();
      } else {
          alert(res.statusText);
      }
  }
};

document.querySelector('.comment-form').addEventListener('submit', commentFormHandler);