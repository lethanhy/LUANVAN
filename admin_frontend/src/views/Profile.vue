<template>
    <div class="page-content page-container" id="page-content">
    <div class="padding">
        <div class="row container d-flex justify-content-center">
            <div class="col-xl-6 col-md-12">
                <div class="card user-card-full">
                    <div class="row m-l-0 m-r-0" v-if="staff">
                        <div class="col-sm-4 bg-c-lite-green user-profile">
                            <div class="card-block text-center text-white">
                                <div class="m-b-25">
                                    <img src="https://img.icons8.com/bubbles/100/000000/user.png" class="img-radius" alt="User-Profile-Image">
                                </div>
                                    <h6 class="f-w-600">{{ staff.name }}</h6>
                                    <p>{{ staff.role }}</p>
                                    <i class=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                                    <div class="d-grid gap-2 justify-content-center">
                                        <button class="btn btn-primary">Sửa hồ sơ</button>
                                        <button class="btn btn-primary"><router-link to="/" class="text-decoration-none text-white">Thoát</router-link></button>
                                    </div>
                                    
                            </div>
                            
                        </div>
                        <div class="col-sm-8">
                            <div class="card-block">
                                <h6 class="m-b-20 p-b-5 b-b-default f-w-600">Thông Tin</h6>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <p class="m-b-10 f-w-600">Email</p>
                                            <h6 class="text-muted f-w-400">rntng@gmail.com</h6>
                                        </div>
                                        <div class="col-sm-6">
                                            <p class="m-b-10 f-w-600">Phone</p>
                                            <h6 class="text-muted f-w-400">{{ staff.phone }}</h6>
                                        </div>
                                    </div>
                                    <h6 class="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">Projects</h6>
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <p class="m-b-10 f-w-600">Recent</p>
                                            <h6 class="text-muted f-w-400">Sam Disuja</h6>
                                        </div>
                                        <div class="col-sm-6">
                                            <p class="m-b-10 f-w-600">Most Viewed</p>
                                            <h6 class="text-muted f-w-400">Dinoter husainm</h6>
                                        </div>
                                    </div>
                                        <ul class="social-link list-unstyled m-t-40 m-b-10">
                                            <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="facebook" data-abc="true"><i class="fa-brands fa-facebook"></i></a></li>
                                            <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="twitter" data-abc="true"><i class="fa-brands fa-twitter"></i></a></li>
                                            <li><a href="#!" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="instagram" data-abc="true"><i class="fa-brands fa-instagram"></i></a></li>
                                        </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import api from '../api';
import { format } from 'date-fns';
import { computed, onMounted } from 'vue';



export default {
  data() {
    return {
      staff: null
    };
  },
       
    computed: {

    },
  
  
        async created() {
            try {
            const staffId = this.$route.params.id; // Get the room ID from the route
            const response = await api.get(`/staff/${staffId}`); // Make the API call with the room ID
            this.staff = response.data; // Store the response data in the `room` object
            console.log('staff ID:', staffId);

            // Fetch the orders after getting the room details
            // await this.getOrder(); // Call getOrder here to fetch orders

            } catch (error) {
            console.log('Failed to load room details:', error);
            }
        },

    methods: {
   
        
    }
};
</script>

<style>
body {
    background-color: #f9f9fa
}

.padding {
    padding: 3rem !important
}

.user-card-full {
    overflow: hidden;
}

.card {
    border-radius: 5px;
    -webkit-box-shadow: 0 1px 20px 0 rgba(69,90,100,0.08);
    box-shadow: 0 1px 20px 0 rgba(69,90,100,0.08);
    border: none;
    margin-bottom: 30px;
}

.m-r-0 {
    margin-right: 0px;
}

.m-l-0 {
    margin-left: 0px;
}

.user-card-full .user-profile {
    border-radius: 5px 0 0 5px;
}

.bg-c-lite-green {
       background: #919aa3;
}

.user-profile {
    padding: 20px 0;
}

.card-block {
    padding: 1.25rem;
}

.m-b-25 {
    margin-bottom: 25px;
}

.img-radius {
    border-radius: 5px;
}


 
h6 {
    font-size: 14px;
}

.card .card-block p {
    line-height: 25px;
}

@media only screen and (min-width: 1400px){
p {
    font-size: 14px;
}
}

.card-block {
    padding: 1.25rem;
}

.b-b-default {
    border-bottom: 1px solid #e0e0e0;
}

.m-b-20 {
    margin-bottom: 20px;
}

.p-b-5 {
    padding-bottom: 5px !important;
}

.card .card-block p {
    line-height: 25px;
}

.m-b-10 {
    margin-bottom: 10px;
}

.text-muted {
    color: #919aa3 !important;
}

.b-b-default {
    border-bottom: 1px solid #e0e0e0;
}

.f-w-600 {
    font-weight: 600;
}

.m-b-20 {
    margin-bottom: 20px;
}

.m-t-40 {
    margin-top: 20px;
}

.p-b-5 {
    padding-bottom: 5px !important;
}

.m-b-10 {
    margin-bottom: 10px;
}

.m-t-40 {
    margin-top: 20px;
}

.user-card-full .social-link li {
    display: inline-block;
}

.user-card-full .social-link li a {
    font-size: 20px;
    margin: 0 10px 0 0;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
}



</style>