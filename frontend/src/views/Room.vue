<template>
  <div class="container room--details">
    <div class="row">
      <!-- Room Image Section -->
      <div class="col-lg-6">
        <img src="../assets/9+ Bold Wall Painting Ideas for a Dramatic Bedroom Look • 333k+ Inspiring Lifestyle Ideas.jpg" alt="Room Image" class="img-fluid">
      </div>

      <!-- Room Details Section -->
      <div class="col-lg-6">
        <h1 class="fw-bold fst-italic">Double Deluxe with Ocean View</h1>
       <p class="text-danger text-start">500.000 VND/Đêm</p>
        <p class="text-start">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
          when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
        
        <!-- Features Section -->
        <div class="d-flex justify-content-around pt-2">
          <div>
            <p><i class="fa-solid fa-bed"></i> King Size Bed</p>
          </div>
          <div>
            <p><i class="fa-solid fa-water"></i> Ocean View</p>
          </div>
        </div>
        <hr>
        
        <div class="d-flex justify-content-around">
          <div>
            <p><i class="fa-solid fa-ruler-combined"></i> 50m² in size</p>
          </div>
          <div>
            <p><i class="fa-solid fa-utensils"></i> Free Breakfast</p>
          </div>
        </div>
        <hr>
        
        <!-- Contact Section -->
        <div class="d-flex justify-content-around align-items-center">
          <div class="d-flex">
            <p class="mt-3">0939 834 780</p>
            <button class="btn btn-success ms-2">
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
          <div>
            <button class="btn btn-success"><router-link to="/order" class="text-decoration-none text-white">Đặt phòng ngay</router-link></button>
          </div>
        </div>
      </div>
    </div>

    <div class="room--body">
      <h2>Room facilities</h2>
      <p>Services of Double views room</p>

      <div>
        <div>
          <i class="fa-solid fa-user-tie" with="50px"></i>
          <p>Daily VIP treatment</p>
        </div>
      </div>
    </div>
  </div>


</template>

<style scoped>
.room--details {
  margin-top: 7rem;
}
.room--details img {
  width: 100%;
  border-radius: 8px;
}
.room--details .room--body {
  padding-top: 50px;
}
</style>
