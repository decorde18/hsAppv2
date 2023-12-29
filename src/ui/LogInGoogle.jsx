import { GoogleLogin } from '@react-oauth/google';

function LogInGoogle() {
  console.log('here');
  const responseGoogle = (response) => {
    console.log(response);
  };
  return (
    (
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    ),
    document.getElementById('googleButton')
  );
}

export default LogInGoogle;
