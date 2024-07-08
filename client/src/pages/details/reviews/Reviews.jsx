import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaInfoCircle } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';

import "./style.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import avatar from "../../../assets/avatar.png";
import Img from "../../../components/lazyLoadImage/Img";

const Reviews = ({ reviews, loading }) => {
    const [showMore, setShowMore] = useState(false);
    const [sentiments, setSentiments] = useState([]);
    const [positiveCount, setPositiveCount] = useState(0);
    const [negativeCount, setNegativeCount] = useState(0);

    const { url } = useSelector((state) => state.home);

    useEffect(() => {
        if (!loading && reviews?.results) {
            analyzeSentiments(reviews.results);
        }
    }, [loading, reviews]);

    const handleShowMore = () => {
        setShowMore(!showMore);
    };

    const analyzeSentiments = async (reviews) => {
        const sentimentResults = await Promise.all(reviews.map(async (review) => {
            const sentiment = await getSentiment(review.content);
            return sentiment;
        }));

        const posCount = sentimentResults.filter(sentiment => sentiment === 'positive').length;
        const negCount = sentimentResults.filter(sentiment => sentiment === 'negative').length;

        setSentiments(sentimentResults);
        setPositiveCount(posCount);
        setNegativeCount(negCount);
    };

    const getSentiment = async (text) => {
        const maxTokens = 512;
        const truncatedText = text.length > maxTokens ? text.substring(0, maxTokens) : text;

        const data = { inputs: truncatedText };
        const modelUrl = import.meta.env.VITE_APP_HUGGING_FACE_SENTIMENT_ANALYSIS_MODEL;
        const modelToken = import.meta.env.VITE_APP_HUGGING_FACE_TOKEN;
        
        const fetchSentiment = async (retryCount = 3, delay = 5000) => {
            try {
                const response = await fetch(
                    modelUrl,
                    {
                        headers: {
                            Authorization: "Bearer " + modelToken,
                            "Content-Type": "application/json",
                        },
                        method: "POST",
                        body: JSON.stringify(data),
                    }
                );
                const result = await response.json();

                if (response.status === 503 && retryCount > 0) {
                    // Model is currently loading, wait and retry
                    await new Promise(res => setTimeout(res, delay));
                    return fetchSentiment(retryCount - 1, delay);
                }

                // Process the result to determine sentiment
                const topLabel = result[0].reduce((prev, current) => (prev.score > current.score) ? prev : current).label;
                return topLabel === "LABEL_1" ? 'positive' : 'negative';
            } catch (error) {
                console.error("Error fetching sentiment:", error);
                return 'unknown';
            }
        };

        return fetchSentiment();
    };

    const skeleton = () => {
        return (
            <div className="skItem">
                <div className="row skeleton"></div>
                <div className="row2 skeleton"></div>
            </div>
        );
    };

    return (
        <div className="reviewsSection">
            <ContentWrapper>
                <div className="sectionHeading">
                    Reviews (Positive: {positiveCount}, Negative: {negativeCount})
                    <FaInfoCircle className="infoIcon" data-tooltip-id="tooltip-info"/>
                    <Tooltip id="tooltip-info" place="top" effect="solid">
                        We are using a sentiment analysis machine learning model to generate the sentiment of each review. Sometimes the review sentiment might be wrong.
                    </Tooltip>
                </div>
                {!loading ? (
                    reviews?.results?.length > 0 ? (
                        <div className="listItems">
                            {reviews?.results?.slice(0, showMore ? reviews?.results?.length : 1).map((review, index) => (
                                <div key={index} className="listItem">
                                    <div className="profileImg">
                                        <Img src={review.author_details.avatar_path ? `${url.profile}${review.author_details.avatar_path}` : avatar} />
                                    </div>
                                    <div className="details">
                                        <div className="author">
                                            <strong>{review.author}</strong> wrote:
                                        </div>
                                        <div className="content">
                                            {review.content}
                                        </div>
                                        <div className="sentiment">
                                            Sentiment: {sentiments[index]}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {reviews?.results?.length > 1 && (
                                <div className="showMore" onClick={handleShowMore}>
                                    {showMore ? "Show Less" : "Show More"}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="noReviews">No reviews available</div>
                    )
                ) : (
                    <div className="reviewsSkeleton">
                        {skeleton()}
                        {skeleton()}
                        {skeleton()}
                    </div>
                )}
            </ContentWrapper>
        </div>
    );
};

export default Reviews;
