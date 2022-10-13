async function deleteFormHandler(event){
  event.preventDefault();

  const deletedID = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
  ];

  await fetch(`/api/post/${deletedID}`, {
      method: 'DELETE'
  });

  if (res.ok) {
      document.location.replace('/dashboard/');
    } else {
      alert(res.statusText);
    } 
}

document.querySelector('.delete-btn').addEventListener('click', deleteFormHandler);