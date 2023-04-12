import Pool from "./UserPool";
import { createContext } from "react";
import { useHistory } from "react-router";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";

const AccountContext = createContext();

const Account = (props) => {
  const history = useHistory();

  const getSession = async () => {
    return await new Promise((resolve, reject) => {
      const user = Pool.getCurrentUser();
      if (user) {
        user.getSession(async (error, session) => {
          if (error) {
            props.setIsLoggedIn(false);
            history.push("/");
            reject();
          } else {
            props.setIsLoggedIn(true);
            const attributes = await new Promise((resolve, reject) => {
              user.getUserAttributes((err, attributes) => {
                if (err) {
                  reject(err);
                } else {
                  const results = {};
                  for (let attribute of attributes) {
                    const { Name, Value } = attribute;
                    results[Name] = Value;
                  }
                  resolve(results);
                }
              });
            });

            resolve({ user, ...session, ...attributes });
          }
        });
      } else {
        reject();
        props.setIsLoggedIn(false);
        history.push("/");
      }
    });
  };

  const authenticate = async (Username, Password) => {
    return await new Promise((resolve, reject) => {
      const user = new CognitoUser({
        Username,
        Pool,
      });

      const authDetails = new AuthenticationDetails({
        Username,
        Password,
      });

      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          resolve(data);
        },
        onFailure: (error) => {
          reject(error);
        },
        newPasswordRequired: (data) => {
          resolve(data);
        },
      });
    });
  };

  const logoutUser = () => {
    const user = Pool.getCurrentUser();
    if (user) {
      user.signOut();
      props.setIsLoggedIn(false);
      history.push("/");
    }
  };

  return (
    <AccountContext.Provider value={{ authenticate, getSession, logoutUser }}>
      {props.children}
    </AccountContext.Provider>
  );
};

export { Account, AccountContext };
