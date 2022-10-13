async function newFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector('.post-title').value;
  const post_body = document.querySelector('.post-body').value;

  const res = await fetch('/api/post', {
    method: 'POST',
    body: JSON.stringify({
      title,
      post_body
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if(res.ok) {
    document.location.replace('/dashboard');
  } else {
    alert(res.statusText);
  }
}

document.querySelector('.new-post').addEventListener('submit', newFormHandler);