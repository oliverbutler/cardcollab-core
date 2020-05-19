import Head from "next/head";
import { motion } from "framer-motion";

const index = () => {
  return (
    
    <div className="container">
      <Head>
        <title>CardCollab 📚</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <div>        
          <input type="file" id="fileUpload"></input>    
       </div>    
        <div> 
           <button onclick="s3upload()">Submit</button>    
        </div>     

    </div>
  );
};

export default index;
