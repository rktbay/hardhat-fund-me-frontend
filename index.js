import {ethers} from "https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.0/ethers.esm.min.js"
import {abi, contractAddress} from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");

connectButton.onclick = connect
fundButton.onclick = fund

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        //make MM popup
        window.ethereum.request({ method: "eth_requestAccounts" });
        connectButton.innerHTML = "Connected!";
        console.log(ethers);
    } else {
        //pls install metamask logic
        connectButton.innerHTML = "Please install metamask";
    }
}

async function fund () {
    const ethAmount= "0.1";
    console.log("Funding ETH...");
    if (typeof window.ethereum !== "undefined") {
        //adds the http endpoint by reading our metamask (window.ethereum)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner() //returns which wallet is connected to MM rn
        console.log(signer);
        const contract = new ethers.Contract(contractAddress, abi, signer);
        try{
            const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)})
            await listenForTransaciton(transactionResponse, provider)
            //listenForTransaciton nows returns a promise, it will wait before it fires Done
            console.log("Done!");
            //event (emit from backend) if not
            //listen for tx to be mined
        }catch(error){
            console.log(error);
        }
       

        //provider / connection to block
        //wallet sign
        //contract.fund(ethAmount)
        //abi and adrress
    }
}

function listenForTransaciton(transactionResponse, provider){
    console.log(`Mining ${transactionResponse.hash}...`)
    //listen for txn to finish, fire anonymouse function when txn done
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt)=>{
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
            resolve() //so console.log("Done") will wait for listenTransaction to finish
        })
    })
}

//withdraw