<template>
    <div class="review">
        <h1 class="text-center mb-4 text-info fw-bold">Đánh Giá</h1>
        <div class="review--body">
            <table class="table table-striped table-hover text-center table-borderless">
                <thead>
                    <tr class="text-center">
                        <th scope="col">STT</th>
                        <th scope="col">Ngày</th>
                        <th scope="col">Khách hàng</th>
                        <th scope="col">Địa chỉ</th>
                        <th scope="col">Đánh giá</th>
                        <th scope="col">Nội dung</th>
                        <th scope="col">Trạng thái</th>
                        <th scope="col">Phản hồi</th>
                        
                        <th scope="col">Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="reviews.length === 0">
                        <td colspan="8">Không tìm thấy đánh giá</td>
                    </tr>
                    <tr v-for="(review, index) in reviews" :key="review._id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ formatDate(review.createdAt) }}</td>
                        <td>{{ review.customer.name }}</td>
                        <td>{{ review.customer.address }}</td>
                        <td>
                            <!-- <div class="d-flex align-items-center"> -->
                                <i v-for="star in 5" :key="star" :class="getStarClass(review.rating, star)"></i>
                                <strong class="ms-2">{{ review.rating }}</strong>
                            <!-- </div> -->
                        </td>
                        <td class="review-content">
                            {{ truncateText(review.noidung, 50) }} <!-- Cắt ngắn nội dung -->
                        </td>
                        <td>
                            <div :class="{ 'review--true': review.phanhoi , 'review--false': !review.phanhoi }">
                                <p>{{ review.phanhoi ? 'Đã phản hồi' : 'Chưa phản hồi' }}</p>
                            </div>
                        </td>
                        <td v-if="!review.phanhoi">
                            <button type="button" class="btn btn-warning"><i class="fa-solid fa-pen-to-square text-white"></i></button>
                        </td>
                        <td v-if="review.phanhoi">
                            <button type="button" class="btn btn-info"><i class="fa-solid fa-eye text-white"></i></button>
                        </td>

                        <td>
                            <button type="button" class="btn btn-danger"><i class="fa-solid fa-xmark"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import api from '../api';

export default {
    data() {
        return {
            reviews: [], // Array to hold reviews data
        };
    },
    methods: {
        async getAllReviews() {
            try {
                const response = await api.get('/review');
                this.reviews = response.data; // Set reviews data
            } catch (error) {
                console.log('Error fetching reviews:', error);
            }
        },
        getStarClass(rating, star) {
            return star <= rating ? 'fa-solid fa-star text-warning' : 'fa-regular fa-star';
        },
        truncateText(text, maxLength) {
            return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Date(dateString).toLocaleDateString('vi-VN', options);
        }
    },
    created() {
        this.getAllReviews();
    }
}
</script>

<style>
.review {
    background: #fff;
    padding: 1rem; /* Reduced padding */
    border-radius: 8px; /* Slightly smaller border radius */
}
.review-content {
    max-width: 200px; /* Giới hạn chiều rộng cột */
    white-space: normal; /* Tự động xuống dòng nếu nội dung quá dài */
    word-wrap: break-word; /* Ngắt dòng từ bất kỳ đâu khi cần */
}
.review--true {
    background:rgb(211, 255, 222);
    border:  2px solid rgb(117, 236, 48);
    border-radius: 30px;
}
.review--true p {
    margin-bottom: 0px;
    padding: 2px;
    color:  rgb(57, 216, 57);
    font-weight: 200;
}
.review--false {
    background:rgb(255, 219, 211);
    border:  2px solid rgb(250, 119, 26);
    border-radius: 30px;
}
.review--false p {
    margin-bottom: 0px;
    padding: 2px;
    color:  rgb(222, 103, 34);
    font-weight: 200;
}
</style>
