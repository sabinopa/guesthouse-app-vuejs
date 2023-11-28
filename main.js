const app = Vue.createApp({
  data() {
    return {
      searchText: '',
      errorMessage: '',
      id: '',
      brandName: '',
      description: '',
      phoneNumber: '',
      email: '',
      petFriendly: '',
      usagePolicy: '',
      address: '',
      neighbourhood: '',
      city: '',
      state: '',
      guesthouses: [],
      guesthouse: {},
      rooms: [],
      showRooms: false,
      showGuesthouseDetails: false,
    };
  },

  computed: {
    filteredGuesthouses() {
      if (this.searchText) {
        return this.guesthouses.filter((guesthouse) => {
          return guesthouse.brandName
            .toLowerCase()
            .includes(this.searchText.toLowerCase());
        });
      } else {
        return this.guesthouses;
      }
    },
  },

  async mounted() {
    await this.getGuesthouses();
  },

  methods: {
    async getGuesthouses() {
      this.showDetails();
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

        if (!response.ok) {
          let errorData = await response.json();
          this.errorMessage = errorData.message || 'Erro desconhecido'; // Use a mensagem de erro do servidor, se disponível
          return; // Encerra a execução do método neste ponto
        }

        let data = await response.json();
        this.guesthouses = [];

        data.forEach((item) => {
          var guesthouse = new Object();

          guesthouse.id = item.id;
          guesthouse.brandName = item.brand_name;
          this.guesthouses.push(guesthouse);
        });
        document.querySelector('main').hidden = false;
      } catch (e) {
        this.errorMessage = e.message || 'Erro de conexão ou resposta inválida'; // Captura erros de rede ou de parsing do JSON
      }
    },

    async getDetails(id) {
      this.showDetails();
      this.rooms = [];
      this.errorMessage = '';

      try {
        let response = await fetch(
          'http://localhost:3000/api/v1/guesthouses/' + id
        );

        if (!response.ok) {
          let errorData = await response.json();
          this.errorMessage = errorData.message || 'Erro desconhecido'; // Use a mensagem de erro do servidor, se disponível
          return; // Encerra a execução do método neste ponto
        }

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

        this.id = id;

        this.guesthouse = guesthouse;

        this.showGuesthouseDetails = true;
        this.showRooms = true;
      } catch (e) {
        this.errorMessage = 'Dados indisponíveis';
      }
    },

    RoomsList(list) {
       
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

      this.showRooms = true;
    },

    showDetails() {
      this.showGuesthouseDetails = false;
      this.showRooms = false;
    },
  },
});

app.mount('#app');