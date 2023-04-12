import { useHistory } from "react-router";

export default function FeedbackDialog(props: {
  title: string;
  message: string;
  closeDialog: any;
  nextPage?: string;
}) {
  const history = useHistory();

  

  return (
    <>
      <div className="flex justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-sm">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <h3 className="text-3xl font-semibold">{props.title}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => {
                  if (props.nextPage==="stay"){
                    history.go(0)
                  }
                  else if (props.nextPage && props.nextPage.length > 0) {
                    props.closeDialog(false);
                    history.push(props.nextPage);
                  } else props.closeDialog(false);
                }}
              >
                <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <p className="my-4 leading-relaxed">{props.message}</p>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button
                className="bg-green text-white active:bg-green-dark uppercase font-bold px-6 py-3 rounded rounded-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => {
                  if (props.nextPage==="stay"){
                    history.go(0)
                  }
                  else if (props.nextPage && props.nextPage.length > 0) {
                    props.closeDialog(false);
                    history.push(props.nextPage);
                  } else props.closeDialog(false);
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
