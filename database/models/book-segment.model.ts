import { model, Schema, models, Types } from "mongoose";
import { IBookSegment } from "@/types";

const BookSegmentSchema = new Schema<IBookSegment>({
    clerkId: { type: String, required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
    content: { type: String, required: true },
    segmentIndex: { type: Number, required: true, index: true },
    pageNumber: { type: Number, index: true, },
    wordCount: { type: Number, required: true },
}, { timestamps: true });
 
// whn vapi read book, it fetches segment in order of segmentIndex, so we need to ensure that segmentIndex is unique for each bookId
BookSegmentSchema.index({ bookId: 1, segmentIndex: 1 }, { unique: true });

// pageno. enables faster search when user ask question about specific page, we can quickly find the segment that contains the page number
BookSegmentSchema.index({ bookId: 1, pageNumber: 1 });

// content. enables faster search when user ask question about specific content, we can quickly find the segment that contains the content
BookSegmentSchema.index({ bookId: 1, content: 'text' });

const BookSegment = models.BookSegment || model<IBookSegment>('BookSegment', BookSegmentSchema);

export default BookSegment;