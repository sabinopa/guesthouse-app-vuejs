const app = Vue.createApp({
  data() {
    return {
      searchText: '',
      errorMessage: '',
      guesthouses: [],
      guesthouse: {},
      rooms: [],
      cities: [],
      city: '',
      showGuesthouseRoomDetails: false,
      showGuesthouseDetails: false,
      showAvailabilityForm: false,
      roomId: '',
      startDate: '',
      endDate: '',
      numberGuests: '',
      bookingPrice: '',
      available: false,
      errors: [],
      guesthousesList: [],
      showCityGuesthouses: false
    };
  },

  computed: {
    filteredGuesthouses() {
      if (this.city) {
        return this.guesthousesList;
      } else if (this.searchText) {
        return this.guesthouses.filter((guesthouse) => {
          return guesthouse.brandName.toLowerCase().includes(this.searchText.toLowerCase());
        });
      } else {
        return this.guesthouses;
      }
    },
  },

  async mounted() {
    await this.getGuesthouses();
    await this.getCities();
  },

  methods: {
    
    async getGuesthouses() {
      this.hideDetails();
      this.errorMessage = '';

      try {
        let url = '';
        if (this.searchText) {
          url =
            'http://localhost:3000/api/v1/guesthouses/?search=' +
            this.searchText;
        } else {
          url = 'http://localhost:3000/api/v1/guesthouses';
        }

        let response = await fetch(url);

        let data = await response.json();
        this.guesthouses = [];

        data.forEach((item) => {
          var guesthouse = new Object();

          guesthouse.id = item.id;
          guesthouse.brandName = item.brand_name;
          this.guesthouses.push(guesthouse);
        });
        document.querySelector('main').hidden = false;
      } catch (error) {
        this.errorMessage = error.message || 'Erro de conexão ou resposta inválida'; 
      }
    },
    async getCities() {
      try {
        let response = await fetch('http://localhost:3000/api/v1/guesthouses/cities');
        let cities = await response.json();
        this.cities = cities.map(city => ({ city }));
      } catch (error) {
        this.errorMessage = 'Dados indisponíveis';
      }
    },

    async getDetails(id) {
      this.hideDetails();
      this.rooms = [];
      this.errorMessage = '';

      try {
        let response = await fetch(
          'http://localhost:3000/api/v1/guesthouses/' + id
        );

        let { guesthouse } = await response.json();

        this.guesthouseId = guesthouse.id;
        this.brandName = guesthouse.brand_name;
        this.averageRating = guesthouse.average_rating;
        this.description = guesthouse.description;
        this.phoneNumber = guesthouse.phone_number;
        this.email = guesthouse.email;
        this.petFriendly = guesthouse.pet_friendly ? 'Aceita pets' : 'Não aceita pets';
        this.usagePolicy = guesthouse.usage_policy;
        this.address = guesthouse.address;
        this.neighbourhood = guesthouse.neighbourhood;
        this.city = guesthouse.city;
        this.state = guesthouse.state;
        this.rooms = guesthouse.available_rooms;
        
        this.id = id;

        this.guesthouse = guesthouse;

        this.showGuesthouseDetails = true;
      } catch (error) {
        this.errorMessage = 'Dados indisponíveis';
      }
    },
    
    RoomsList(list) {
      this.hideDetails();
      this.rooms = [];

      list.forEach((item) => {
        let room = {};
        room.id = item.id;
        room.name = item.name;
        room.description = item.description;
        room.price = item.price;
        room.size = item.size;
        room.maxPeople = item.max_people;
        room.bathroom = item.bathroom ? 'Particular' : 'Compartilhado';
        room.balcony = item.balcony ? 'Possui' : 'Não Possui';
        room.airConditioner = item.air_conditioner ? 'Possui' : 'Não Possui';
        room.tv = item.tv ? 'Possui' : 'Não Possui';
        room.wardrobe = item.wardrobe ? 'Possui' : 'Não Possui';
        room.safe = item.safe ? 'Possui' : 'Não Possui';
        room.accessibility = item.accessibility
          ? 'Acessível para pessoas com deficiência'
          : 'Não Acessível';

        this.rooms.push(room);
      });
      this.showGuesthouseDetails = true;
      this.showGuesthouseRoomDetails = true;
    },
    
    hideDetails() {
      this.showGuesthouseDetails = false;
      this.showGuesthouseRoomDetails = false;
    },
    
    async availability(roomId) {
      this.errorMessage = '';
      this.showAvailabilityForm = true;
    
      let response = await fetch(`http://localhost:3000/api/v1/guesthouses/${this.guesthouseId}/rooms/${roomId}/availability/?` +
                                `start_date=${this.startDate}&end_date=${this.endDate}&number_guests=${this.numberGuests}`);
    
      let data = await response.json();
      this.available = data.available;
    
      if (data.total_price !== undefined) {
        this.bookingPrice = data.total_price;
      } else if (this.available === false) {
        this.errorMessage = data.message || 'Erro ao verificar disponibilidade.';
      } else {
        this.errors = data.errors || [];
      }
    },

    hideForm(roomId){
      this.showAvailabilityForm = false,
      this.startDate = '',
      this.endDate = '',
      this.numberGuests = '',
      this.roomId = roomId
    },

    async getGuesthousesCities(city) {
      this.hideDetails();
    
      try {
        let response = await fetch(`http://localhost:3000/api/v1/guesthouses/by_city?city=${city}`);
        let guesthouses_city = await response.json();
        this.guesthousesList = guesthouses_city.map(item => {
          return {
            brandName: item.brand_name,
            description: item.description,
            email: item.email,
            contact: item.contact,
            city: item.city,
            id: item.id
          };
        });
        this.city = city;
      } catch (error) {
        this.errorMessage = 'Dados indisponíveis';
      }
    },

    resetCity() {
      this.city = '';
    },
  }  
});

app.mount('#app');
