import { createContext, useState } from "react";
import run from "../config/gemini";
export const Context = createContext();

const ContextProvider =(props) => {

    const [input,setInput] = useState("");                 //used for input from user
    const [recentPrompts, setRecentPrompts] = useState("");  // used for storing the prompt in sidebar
    const [prevPrompts, setPrevPrompts] = useState([]);      //used to show previous propmts in sidebar and store in form of array
    const [showResult, setShowResult] = useState(false);   //used to remove the 4 cards and shoe result of actual  prompt
    const [loading,setLoading] =useState("false");         //used to shoe loading animation
    const [resultData, setResultData] = useState("");      //used to store result data


    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev=>prev+nextWord);
        },75*index)
    }

    const newChat =()=> {
        setLoading(false)
        setShowResult(false)

    }

    const onSent = async (prompt)=>{

        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;

        if (prompt !== undefined) {
            response = await run(prompt);
            setRecentPrompts(prompt)
        }else{
            setPrevPrompts(prev=>[...prev,input])
            setRecentPrompts(input)
            response = await run(input)
        }
        // setRecentPrompts(input)
        // setPrevPrompts(prev=>[...prev,input])
        // const response = await run(input)
        let responseArray = response.split("**");
        let newResponse= "";
        for(let i=0;i<responseArray.length;i++) {
            if (i ===0 || i%2 !== 1) {
                newResponse += responseArray[i]
            }
            else {
                newResponse += "<b>"+responseArray[i]+"</b>"
            }
        }

        let newResponse2 = newResponse.split("*").join("</br>")
        // setResultData(newResponse2)
        let newResponseArray = newResponse2.split(" ");
        for(let i=0; i<newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ")
        }
        setLoading(false)
        setInput("")
    }
    

    //used so that we can access all the useState hooks directly in the main and sidebar components w/o importing them again and again separately
    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompts,
        recentPrompts,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider