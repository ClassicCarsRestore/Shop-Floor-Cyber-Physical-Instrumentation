import { AccountContext } from "../log-in-copy/Account";
import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import logoRaimundo from "../../Logo RB Texto.jpeg";
import FeedbackDialog from "../Utils/FeedbackDialog";

const LogInForm = (props: {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}) => {
    
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const history = useHistory();

  const { authenticate } = useContext(AccountContext);

  const handleLogIn = async (e: any) => {
    e.preventDefault();

    authenticate(email, password)
      .then((data: any) => {
        props.setIsLoggedIn(true);
        localStorage.setItem("pass", password);
        localStorage.setItem("email", email);
        history.push("/sensorboxes");
      })
      .catch((error: any) => {
        props.setIsLoggedIn(false);
        setDialogTitle("Error");
        setDialogMessage("Log in Failed." + error.toString().split(":")[1]);
        setOpenDialog(true);
      });
  };

  const forgotPassword = () => {
    history.push("/forgot");
  };

  const classes = {
    pageBody:
      "w-auto space-y container mx-auto h-screen flex justify-center items-center pr-40",
    logoImage: "h-20 w-45",
    logoImageContainer: "w-60 flex flex-shrink-0 justify-center",
    formContainer:
      "w-full bg-white rounded-lg border border-primaryBorder shadow-default py-6 px-10",
    formHeading: "text-2xl font-medium text-primary mt-4 mb-12 text-center",
    btnContainer: "flex justify-center items-center mt-6",
    input: `w-full p-2 text-primary border rounded-md outline-none  transition duration-150 ease-in-out mb-4`,
    button: `bg-green hover:bg-green-darker py-2 px-4 text-white rounded border border-green focus:outline-none focus:border-green-dark`,
    forgotPassword: "flex justify-center items-center mt-6",
    textStyle: "text-blue font-semibold",
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
        <div className={classes.formContainer}>
          <h1 className={classes.formHeading}>Log in to your account</h1>

          <form onSubmit={handleLogIn}>
            <input
              id="email"
              className={classes.input}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your Email"
            />
            <input
              id="password"
              className={classes.input}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your Password"
            />

            <div className={classes.btnContainer}>
              <button className={classes.button} type="submit">
                Login
              </button>
            </div>
          </form>

          <div className={classes.forgotPassword}>
            <button className={classes.textStyle} onClick={forgotPassword}>
              Forgot Password? Click here.
            </button>
          </div>
        </div>
      </div>

      {openDialog && (
        <div className="flex justify-center items-center text-center">
          <FeedbackDialog
            title={dialogTitle}
            message={dialogMessage}
            closeDialog={setOpenDialog}
          />
        </div>
      )}
    </>
  );
};

export default LogInForm;
