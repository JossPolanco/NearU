import { supabaseClient } from "../../utils/supabase";

export async function getDateReviews(dateId) {
    const { data, error } = await supabaseClient
        .from("tbl_date_reviews")
        .select("*")
        .eq("date_id", dateId)
        .eq("active", true)
        .single()

    if (error) throw error
    return data
}

export async function createReview({ date_id, review }) {
    const { data, error } = await supabaseClient
        .from("tbl_date_reviews")
        .insert({ date_id: date_id, review: review })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateReview({ id, title, description, rating }) {
    const { data, error } = await supabaseClient
        .from("tbl_date_reviews")
        .update({ title: title, description: description, rating: rating })
        .eq("id", id)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteReview(id) {
    const { error } = await supabaseClient
        .from("tbl_date_reviews")
        .update({ active: false })
        .eq("id", id)

    if (error) throw error
}

export async function saveReviewImage({ reviewId, imageMetadataId, orderIndex = 0 }) {
    const { data, error } = await supabaseClient
        .from("tbl_date_review_images")
        .insert({
            review_id: reviewId,
            image_metadata_id: imageMetadataId,
            order_index: orderIndex
        })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteReviewImage({ reviewId, imageMetadataId, deletePhysicalFile = true }) {
    let metadata = null
    if (deletePhysicalFile) {
        const { data, error: metaError } = await supabaseClient
            .from("image_metadata")
            .select("storage_path, bucket")
            .eq("id", imageMetadataId)
            .single()

        if (metaError && metaError.code !== "PGRST116") {
            throw metaError
        }
        metadata = data
    }

    const { error: assocError } = await supabaseClient
        .from("tbl_date_review_images")
        .delete()
        .eq("review_id", reviewId)
        .eq("image_metadata_id", imageMetadataId)

    if (assocError) throw assocError

    if (deletePhysicalFile && metadata) {
        const { error: deleteMetaError } = await supabaseClient
            .from("image_metadata")
            .delete()
            .eq("id", imageMetadataId)

        if (deleteMetaError) throw deleteMetaError

        const { error: storageError } = await supabaseClient.storage
            .from(metadata.bucket)
            .remove([metadata.storage_path])

        if (storageError) {
            console.error("Error deleting image from storage:", storageError)
        }
    }
}

export async function getReviewImages(reviewId) {
    const { data, error } = await supabaseClient
        .from("tbl_date_review_images")
        .select(`
            id,
            image_metadata_id,
            order_index,
            image_metadata (
                id,
                storage_path,
                width,
                height
            )
        `)
        .eq("review_id", reviewId)
        .eq("active", true)
        .order("order_index", { ascending: true })

    if (error) throw error
    return data
}