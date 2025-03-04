import { HomeView } from "@/modules/home/ui/views/home-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic"

interface pageProps{
  searchParams:Promise<{categoryId:string}>
}

const Page = async ({searchParams}:pageProps)=> {

  const {categoryId} = await searchParams

  void await trpc.categories.getMany.prefetch()
  
  return (
    
    <HydrateClient>
      
      <HomeView categoryId={categoryId}/>
      
    </HydrateClient>
  );
}

export default Page
