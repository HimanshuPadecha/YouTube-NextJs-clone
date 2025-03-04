"use client"

import { FilterCarousel } from "@/components/filter-carousel"
import { trpc } from "@/trpc/client"
import { useRouter } from "next/navigation"
import { Suspense } from "react"
import {ErrorBoundary} from "react-error-boundary"

interface CategoriesSectionProps { 
    categoryId:string
}

export const CategoriesSection = ({categoryId}:CategoriesSectionProps)=>{
    return (
        <Suspense fallback={<FilterCarousel isLoading data={[]} onSelect={()=>{}}/> }>
            <ErrorBoundary fallback={<p>Error..</p>}>
                <CategoriesSectionSuspence categoryId={categoryId}/>
            </ErrorBoundary>
        </Suspense>
    )
}

const CategoriesSectionSuspence = ({categoryId}:CategoriesSectionProps)=>{
    const router = useRouter()
    const [categories] = trpc.categories.getMany.useSuspenseQuery()

    const data = categories.map((category)=> ({value:category.id,label:category.name}))
     
    const onSelect = (value:string|null) =>{
        const url = new URL(window.location.href)
        if(value){
            url.searchParams.set("categoryId",value)
        }else{
            url.searchParams.delete("caterogyId")
        }
        router.push(url.toString())
        
    }
    return (
        <FilterCarousel value={categoryId} onSelect={onSelect} data={data} /> 
    )
}