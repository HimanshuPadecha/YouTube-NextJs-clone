import { eq } from "drizzle-orm"
import {
    VideoAssetCreatedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetReadyWebhookEvent,
    VideoAssetTrackReadyWebhookEvent,
    VideoAssetDeletedWebhookEvent
} from "@mux/mux-node/resources/webhooks"
import { headers } from "next/headers"
import { mux } from "@/lib/mux"
import { db } from "@/db"
import { videos } from "@/db/schema"
import { UTApi } from "uploadthing/server"

const SIGNING_SECRET = process.env.MUX_SIGNING_SECRET!


type WebhookEvent = | VideoAssetCreatedWebhookEvent | VideoAssetReadyWebhookEvent | VideoAssetErroredWebhookEvent | VideoAssetTrackReadyWebhookEvent | VideoAssetDeletedWebhookEvent


export const POST = async (request : Request) => {
    if(!SIGNING_SECRET){
        throw new Error("MUX_WEBHOOK SECRET not set")
    }
    
    // console.log(request.headers);
    const {headers} = request

    const payload = await request.json()

    const body = JSON.stringify(payload)

    mux.webhooks.verifySignature(body,headers,SIGNING_SECRET)
    
    switch(payload.type as WebhookEvent["type"]){
        case "video.asset.created" : {
            const data = payload.data as VideoAssetCreatedWebhookEvent["data"]

            if(!data.upload_id){
                return new Response("no upload id found",{status:500})
            }

            await db
                .update(videos)
                .set({
                    muxAssetId:data.id,
                    muxStatus:data.status
                })
                .where(eq(videos.muxUploadId,data.upload_id))
            break;
        }

        case "video.asset.ready":{
            const data = payload.data as VideoAssetReadyWebhookEvent["data"]

            const playbackId = data.playback_ids?.[0].id

            if(!playbackId){
                return new Response("Missing playback id",{status:400})
            }

            if(!data.upload_id){
                return new Response("No uplaod id",{status:400})
            }
            const duration = data.duration ? Math.round(data.duration * 1000): 0  

            const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`
            const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`

            const utapi = new UTApi()

            const [uploadedPreview,uploadedThumbnail] = await utapi.uploadFilesFromUrl([tempPreviewUrl, tempThumbnailUrl])

            if(!uploadedPreview.data || !uploadedThumbnail.data){
                return new Response("thumbnail or preview unable to upload" , {status : 500})
            }

            const { key : previewKey,url : previewUrl } = uploadedPreview.data
            const { key : thumbnailKey,url : thumbnailUrl } = uploadedThumbnail.data

            await db
                .update(videos)
                .set({
                    muxStatus:data.status,
                    muxPlaybackId:playbackId,
                    muxAssetId:data.id,
                    thumbnailUrl,
                    thumbnailKey,
                    previewKey,
                    previewUrl,
                    duration
                })
                .where(eq(videos.muxUploadId,data.upload_id))
            break
        }

        case "video.asset.errored":{
            const data = payload.data as VideoAssetErroredWebhookEvent["data"]

            if(!data.upload_id){
                return new Response("No uplaod id",{status:400})
            }

            await db
                .update(videos)
                .set({
                    muxStatus:data.status
                })
                .where(eq(videos.muxUploadId,data.upload_id))
            break
        }

        case "video.asset.deleted" :{ 
            const data = payload.data as VideoAssetDeletedWebhookEvent["data"]

            if(!data.upload_id){
                return new Response("No uplaod id",{status:400})
            }

            await db
                .delete(videos)
                .where(eq(videos.muxUploadId,data.upload_id))
            break
        }

        case "video.asset.track.ready":{
            const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
                asset_id:string
            }

            const assetId = data.asset_id
            const trackId = data.id
            const status = data.status

            if(!assetId){
                return new Response("No uplaod id",{status:400})
            }

            await db
                .update(videos)
                .set({
                    muxTrackId:trackId,
                    muxTrackStatus:status
                })
                .where(eq(videos.muxAssetId,assetId))
            break
        }
    }

    return new Response("webhook received",{status:200})
}
