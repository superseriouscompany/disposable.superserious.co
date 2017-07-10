module.exports = {
  shouldFail: shouldFail,
}

function shouldFail(r) {
  let err;
  if( r && r.statusCode ) {
    err = new Error(`Expected an unsuccessful response, got: ${r.statusCode} ${JSON.stringify(r.body)}`);
    err.statusCode = r.statusCode;
    err.response = { body: r.body };
  } else {
    err = new Error(`Expected an unsuccessful response, got: ${JSON.stringify(r)}`);
    err.statusCode = 'No Status Code (Should have failed)';
  }
  err.name = 'ShouldHaveFailed';
  throw err;
}
