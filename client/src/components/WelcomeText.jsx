
function WelcomeText() {
  return (
    <div className=" bg-[#F5F9E9] w-full h-[100vh] pt-10">
<main className="h-full flex flex-col items-center justify-center text-center">
    <div className="my-4">
        <h2 className="text-[#221E1E] font-aldrich text-4xl font-semibold">welcome to voxverse.</h2>
    </div>
    <div className="my-4">
        <p className="font-montserrat italic font-medium md:text-xl text-sm px-2">Discover stories, thinking, and expertise from writers on any topic.</p>
    </div>
    <div className="my-6">
        <button className="w-36 h-12 bg-black text-white rounded-full hover:bg-[#262626] transition shadow-md  duration-500 ease-in-out font-montserrat font-medium  ">Start reading</button>
    </div>
</main>

    </div>
  )
}

export default WelcomeText