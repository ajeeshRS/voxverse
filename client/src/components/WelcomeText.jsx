import { motion } from "framer-motion";
function WelcomeText() {
  return (
    <div className=" bg-gradient-to-b from-slate-100 to-[#fff] w-full h-[100vh] pt-10">
      <main className="h-full flex flex-col items-center justify-center text-center">
        <motion.div 
        initial={{ opacity: 0, x: -100 }} 
        animate={{ opacity: 1, x: 0 }}  
        transition={{ duration: 0.5, ease: "easeOut" }} 
         className="my-4">
          {/* welcome message */}
          <h2 className="text-[#221E1E] font-aldrich text-5xl font-bold">
            Welcome to VoxVerse.
          </h2>
        </motion.div>
        <motion.div
        initial={{ opacity: 0, x: 200 }} 
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
         className="my-4">
          <p className="font-montserrat italic font-medium md:text-xl text-sm px-2">
            Discover stories, thinking, and expertise from writers on any topic.
          </p>
        </motion.div>
        {/* start reading button */}
        <div className="my-6">
          <motion.button
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}  
                  transition={{ duration: 0.5, ease: "easeOut" }} 
            className="w-36 h-12 bg-black text-white rounded-full hover:bg-[#262626] transition shadow-md  duration-500 ease-in-out font-montserrat font-medium  "
          >
            <a href="#start-reading">Start reading</a>
          </motion.button>
        </div>
      </main>
    </div>
  );
}

export default WelcomeText;
