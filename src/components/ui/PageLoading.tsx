const PageLoading = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-white z-50">
      <div className="relative">
        {/* วงกลมพื้นหลังสีจางๆ */}
        <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
        {/* วงกลมหมุนๆ สีม่วง */}
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default PageLoading;
