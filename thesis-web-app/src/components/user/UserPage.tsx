//import { AccountContext } from "../log-in/Account";
import FeedbackDialog from "../Utils/FeedbackDialog";
import { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

const UserPage = (props: { token:any}) => {

  const history = useHistory();
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const [values, setValues] = useState({
    password: sessionStorage.getItem("password") || "",
    showPassword: false,
  });


  async function fetchChangePass(token: string) {
    var myHeaders = new Headers();

    myHeaders.append("Authorization", token);

    const newPasswordData = JSON.stringify({
      email: sessionStorage.getItem("email"),
      password: values.password,
    });

    var requestOptions: RequestInit = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
      body:newPasswordData
    };

    await fetch(
      `http://194.210.120.104:8080/login/newpassword`,
      requestOptions
    )
      .then((response) =>{
        if (response.ok) {
          sessionStorage.setItem('password', values.password);
          setDialogTitle("Success");
          setDialogMessage("Successfully change password.");
          setOpenDialog(true);
        } 
      }
       
      )
      .catch((error) => {
        setDialogTitle("Error");
        setDialogMessage("Could not update the password.");
        setOpenDialog(true);
        history.push("/");
      });
  }

  const saveUserChanges = async (e: any) => {

    if (!props.token){
      history.push("/");
      //logoutUser
    }else{
      fetchChangePass(props.token);
    };
  };

  return (
    <>
      <div className="flex flex-col p-6">
        <h1 className="font-semibold text-lg mb-4">User Details</h1>
        <div className="flex flex-row pl-4 pt-4 pb-4">
          <h2 className="font-semibold mr-4">User Email:</h2>
          <b>{sessionStorage.getItem("email")}</b>
        </div>

        <div className="flex flex-row pl-4 pt-4">
          <h2 className="font-semibold mr-4">Password:</h2>
          <div className="flex flex-row -mt-2">
            <input
              id="password"
              type={values.showPassword ? "text" : "password"}
              value={values.password}
              onChange={(event) =>
                setValues({ ...values, ["password"]: event.target.value })
              }
              className="w-full p-2 text-primary border rounded-md outline-none  transition duration-150 ease-in-out mb-4"
              placeholder="New Password"
            />
            <button
              className="h-10 w-16 ml-6 bg-green hover:bg-green-dark text-white py-1 px-2 rounded rounded-lg border border-green focus:outline-none focus:border-green-dark"
              onClick={() =>
                setValues({ ...values, ["showPassword"]: !values.showPassword })
              }
            >
              {values.showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex flex-row justify-end gap-8">
          <button
            className=" w-34 mt-8 bg-green hover:bg-green-dark text-white py-1 px-2 rounded rounded-lg border border-green focus:outline-none focus:border-green-dark"
            onClick={saveUserChanges}
          >
            Save Changes
          </button>
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

export default UserPage;
