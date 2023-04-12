
import { useState } from "react";
import logoRaimundo from "../../Logo RB Texto.jpeg";
import FeedbackDialog from "../Utils/FeedbackDialog";
import { useHistory } from "react-router-dom";

const ForgotPasswordForm = () => {

  const validEmailRegExp = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  const [nextPage, setNextPage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [stage, setStage] = useState<number>(1); // 1 - insert email, 2 - insert verification code
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const history = useHistory();



  const verifyEmail = async () => {
    if (email === "" || !validEmailRegExp.test(email)) {
      setDialogTitle("Error");
      setDialogMessage("Please insert a valid email in the box above.");
      setOpenDialog(true);
      return;
    }

    // valid email, continue
    
  };

  const resetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setDialogTitle("Error");
      setDialogMessage("The passwords do not match.");
      setOpenDialog(true);
    } else {
      
     
    }
  };

  function backToLogin(){
    history.push("/")
  }

  const classes = {
    pageBody:
      "w-auto space-y container mx-auto h-screen flex justify-center items-center pr-40",
    logoImage: "h-20 w-45",
    logoImageContainer: "w-60 flex flex-shrink-0 justify-center",
    formContainer:
      "w-200 bg-white rounded-lg border border-primaryBorder shadow-default py-6 px-10",
    formHeading: "text-xl font-medium text-primary mt-4 text-center",
    formHeading2: "text-xl font-medium text-primary mt-4 mb-8 text-center",
    btnContainer: "flex justify-center items-center mt-6",
    input: `w-full p-2 text-primary border rounded-md outline-none  transition duration-150 ease-in-out mb-4`,
    button: `bg-green hover:bg-green-darker py-2 px-4 text-white rounded border border-green focus:outline-none focus:border-green-dark`,
    forgotPassword: "flex justify-center items-center mt-6",
    textStyle: "text-blue font-semibold",
    verificationCodeContainer: "flex flex-col",
    buttonStyle:
      "flex justify-center items-center bg-green text-white active:bg-green-dark  font-bold px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150",
  };

  return (
    <>
      <div className={classes.logoImageContainer}>
        <img
          className={classes.logoImage}
          src={logoRaimundo}
          alt="Raimundo Branco Logo"
        />
      </div>

      <div className={classes.pageBody}>
        {stage === 1 && (
          <div className={classes.formContainer}>
            <h1 className={classes.formHeading}>Contact the supporter.</h1>
            <h1 className={classes.formHeading2}>Send an email to rjbranco.aws@gmail.com with the subject "Forgot Password".</h1>

            <div className={classes.verificationCodeContainer}>
              {/* <input
                id="email"
                className={classes.input}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your Email"
              />

              <button className={classes.buttonStyle} onClick={verifyEmail}>
                Send Verification Code
              </button> */}
              <button className={classes.buttonStyle} onClick={backToLogin}>
                Back to Log In page.
              </button>
            </div>
            
          </div>
        )}

        {stage === 2 && (
          <div className={classes.formContainer}>
            <h1 className={classes.formHeading}>Password Reset</h1>
            <h1 className={classes.formHeading2}>
              Insert your email and the verification code sent to your email
              below.
            </h1>
            {/* <div className={classes.verificationCodeContainer}>
              <input
                id="code"
                className={classes.input}
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                placeholder="Your Verification Code"
              />

              <input
                id="password"
                className={classes.input}
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Your New Password"
              />

              <input
                id="newpassword"
                className={classes.input}
                type="password"
                value={confirmNewPassword}
                onChange={(event) => setConfirmNewPassword(event.target.value)}
                placeholder="Confirm Your New Password"
              />

              <button className={classes.buttonStyle} onClick={resetPassword}>
                Change Password
              </button>
            </div> */}
          </div>
        )}
      </div>

      {openDialog && (
        <div className="flex justify-center items-center text-center">
          <FeedbackDialog
            title={dialogTitle}
            message={dialogMessage}
            closeDialog={setOpenDialog}
            nextPage={nextPage}
          />
        </div>
      )}
    </>
  );
};

export default ForgotPasswordForm;
