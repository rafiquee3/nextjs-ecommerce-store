import fetchDataFromAPI from "@/lib/api";

export default async function Home() {
  const products = await fetchDataFromAPI('/api/products').then(res => res.json());
  const categories = await fetchDataFromAPI('/api/categories').then(res => res.json());
  const totalUsers = await fetchDataFromAPI('/api/users').then(res => res.json());

  const productsCount = products.reduce((acc: number, curr: {stock: number}) => acc + curr.stock, 0);
  
  return (
    <div className="bg-[#E2F7FF] w-full flex flex-col pb-8 md:pt-12" style={{ minHeight: 'calc(100vh - 64px - 48px)'}}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 px-10 text-gray-100'>
            <div className='bg-[#BCFFB8] md:max-w-[410px] text-center rounded-3xl py-15 text-[#1B6764] w-full md:justify-self-end'>Total products: {products.length}</div>
            <div className='bg-[#B8CDFF] md:max-w-[410px] text-center rounded-3xl py-15 text-gray-600 w-full'>Total categories: {categories.length}</div>
            <div className='bg-[#FFE7CC] md:max-w-[410px] text-center rounded-3xl py-15 text-[#637091] w-full md:justify-self-end'>Products count: {productsCount}</div>
            <div className='bg-[#67A3FF] md:max-w-[410px] text-center rounded-3xl py-15 text-gray-100 w-full'>Total users: {totalUsers}</div>
        </div>
    </div>
  );
}
