import Pool from "./UserPool";
import { useState } from "react";
import logoRaimundo from "../../Logo RB Texto.jpeg";
import FeedbackDialog from "../Utils/FeedbackDialog";
import { CognitoUser } from "amazon-cognito-identity-js";

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

  const getUser = () => {
    return new CognitoUser({
      Username: email.toLowerCase(),
      Pool,
    });
  };

  const verifyEmail = async () => {
    if (email === "" || !validEmailRegExp.test(email)) {
      setDialogTitle("Error");
      setDialogMessage("Please insert a valid email in the box above.");
      setOpenDialog(true);
      return;
    }

    // valid email, continue
    getUser().forgotPassword({
      onSuccess: (data) => {
        setDialogTitle("Success");
        setDialogMessage(
          "A verification code will be sent to your email shortly."
        );
        setOpenDialog(true);
      },
      onFailure: (err) => {
        setDialogTitle("Error");
        setDialogMessage(
          "Please insert a valid email in the box above. The email needs to be from an active account in the system."
        );
        setOpenDialog(true);
      },
      inputVerificationCode: (data) => {
        setStage(2);
      },
    });
  };

  const resetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setDialogTitle("Error");
      setDialogMessage("The passwords do not match.");
      setOpenDialog(true);
    } else {
      getUser().confirmPassword(verificationCode, newPassword, {
        onSuccess: (data) => {
          setNextPage("/");
          setDialogTitle("Success");
          setDialogMessage("The password was successfully updated.");
          setOpenDialog(true);
        },
        onFailure: (err) => {
          setDialogTitle("Error");
          setDialogMessage(
            "Unable to update the password. Required length of 6 and at least one uppercase character. If the error keeps persisting try again later or contact the system administrator."
          );
          setOpenDialog(true);
        },
      });
    }
  };

  const classes = {
    pageBody:
      "w-auto space-y container mx-auto h-screen flex justify-center items-center pr-40",
    logoImage: "h-20 w-45",
    logoImageContainer: "w-60 flex flex-shrink-0 justify-center",
    formContainer:
      "w-96 bg-white rounded-lg border border-primaryBorder shadow-default py-6 px-10",
    formHeading: "text-2xl font-medium text-primary mt-4 text-center",
    formHeading2: "text-xl font-medium text-primary mt-4 mb-8 text-center",
    btnContainer: "flex justify-center items-center mt-6",
    input: `w-full p-2 text-primary border rounded-md outline-none  transition duration-150 ease-in-out mb-4`,
    button: `bg-green hover:bg-green-darker py-2 px-4 text-white rounded border border-green focus:outline-none focus:border-green-dark`,
    forgotPassword: "flex justify-center items-center mt-6",
    textStyle: "text-blue font-semibold",
    verificationCodeContainer: "flex flex-col",
    buttonStyle:
      "flex justify-center items-center bg-green text-white active:bg-green-dark uppercase font-bold px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150",
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
            <h1 className={classes.formHeading}>Password Reset</h1>
            <h1 className={classes.formHeading2}>Insert your email below.</h1>

            <div className={classes.verificationCodeContainer}>
              <input
                id="email"
                className={classes.input}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your Email"
              />

              <button className={classes.buttonStyle} onClick={verifyEmail}>
                Send Verification Code
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
            <div className={classes.verificationCodeContainer}>
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
            </div>
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
