// AXIOS GLOBALS
// NOTE: token would probably come from server after logging in 
// NOTE: Comment this in/out and check how the 'Config' section in the output changes
axios.defaults.headers.common['X-Auth-Token'] = 'someOtherTokenValue';



// GET REQUEST
function getTodos() {
    // OPTION 1: The Long Way
    // axios({
    //   method: 'get',
    //   url: 'https://jsonplaceholder.typicode.com/todos',
    //   params: {
    //     _limit: 5
    //   }
    // })
    //   .then(res => showOutput(res))
    //   .catch(err => console.log(err));

    // OPTION 2: Shorter Way
    // NOTE: You could also just put the params in the URL
    axios
      .get('https://jsonplaceholder.typicode.com/todos', {
        params: { _limit: 5 },
        // NOTE: ms - this will always timeout
        // timeout: 5
      })
      .then(res => showOutput(res))
      .catch(err => console.log(err))
}
  
// POST REQUEST
function addTodo() {
  axios
    .post('https://jsonplaceholder.typicode.com/todos', {
      data: {
        title: 'New Todo',
        completed: false
      }
    })
    .then(res => showOutput(res))
    .catch(err => console.log(err))
}
  
// PUT/PATCH REQUEST
function updateTodo() {
  // NOTE: the todo ID in the url
  // PUT will update the WHOLE thing (eg. overwrite)
  // Uncomment to see difference
  axios
    // .put('https://jsonplaceholder.typicode.com/todos/1', {
    .patch('https://jsonplaceholder.typicode.com/todos/1', {
        title: 'Updated Todo',
        completed: true
    })
    .then(res => showOutput(res))
    .catch(err => console.log(err))
}
  
// DELETE REQUEST
function removeTodo() {
  axios
    .delete('https://jsonplaceholder.typicode.com/todos/1')
    .then(res => showOutput(res))
    .catch(err => console.log(err))
}
  
// SIMULTANEOUS DATA (Hitting 2 endpoints at the same time)
function getData() {
  axios.all([
    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5'),
    axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5'),
  ])
  // Option 1
    // .then(res => {
    //   console.log(`TODOs: ${res[0]}`);
    //   console.log(`Posts: ${res[1]}`);
    //   showOutput(res[1]);
    // })
  // Option 2 - Cleaner
    .then(axios.spread((todos, posts) => showOutput(posts)))
    .catch(err => console.log(err)) 
}
  
// CUSTOM HEADERS (might use for JWT)
function customHeaders() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authroization: 'sometoken'
    }
  }

  axios
    .post('https://jsonplaceholder.typicode.com/todos', {
      data: {
        title: 'New Todo',
        completed: false,

      },
    },
    config)
    .then(res => showOutput(res))
    .catch(err => console.log(err))
}
  
// TRANSFORMING REQUESTS & RESPONSES (this would work similarly for Request/Response)
function transformResponse() {
  const options = {
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data: {
      title: 'Oh hey there bud'
    },
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.title = data.title.toUpperCase();
      return data;
    })
  };

  axios(options).then(res => showOutput(res));
}
  
// ERROR HANDLING
function errorHandling() {
  axios
  .get('https://jsonplaceholder.typicode.com/todosssss', {
    params: { _limit: 5 },
    // validateStatus: function(status) {
    //   // returns only if status is greater or equal to 500 (eg. Server errors)
    //   return status < 500
    // }
  })
  .then(res => showOutput(res))
  .catch(err => {
    if (err.response) {
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    } else if (err.request) {
      // eg. Request was made but there was no reponse
      console.log(err.request);
    } else {
      console.error(err.message)
    }
  })
}
  
// CANCEL TOKEN
function cancelToken() {
  const source = axios.CancelToken.source();

  axios
  .get('https://jsonplaceholder.typicode.com/todosssss', {
    cancelToken: source.token
  })
  .then(res => showOutput(res))
  .catch(thrown => {
    if (axios.isCancel(thrown)) {
      console.log('Request Canceled', thrown.message);
    }
  });

  // NOTE: this would be something meaningful - not just true (eg. something happens that should trigger a cancel)
  if (true) {
    source.cancel('I canceled it')
  }
}
  
// INTERCEPTING REQUESTS & RESPONSES
// NOTE: this message will show up in the console and then the function will continue on as expected
axios.interceptors.request.use(config => {
  console.log(`${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().getTime()}`);
  return config;
}, error => {
  return Promise.reject(error);
});
  
// AXIOS INSTANCES
const instanceOne = axios.create({
  // Custom Settings (other options - see docs)
  baseURL: 'https://jsonplaceholder.typicode.com'
});

function comments() {
  instanceOne.get('/comments')
    .then(res => showOutput(res));
}
  
function todos() {
  instanceOne.get('/todos')
    .then(res => showOutput(res));
}
  
function posts() {
  instanceOne.get('/posts')
    .then(res => showOutput(res));
}





// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>
  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}
  
// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);
document.getElementById('comments').addEventListener('click', comments);
document.getElementById('todos').addEventListener('click', todos);
document.getElementById('posts').addEventListener('click', posts);
  