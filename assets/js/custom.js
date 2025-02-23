jQuery(document).ready(function($) {

    "use strict";

    // Page loading animation
    $("#preloader").animate({
        'opacity': '0'
    }, 600, function(){
        setTimeout(function(){
            $("#preloader").css("visibility", "hidden").fadeOut();
        }, 300);
    });
    
    $(window).scroll(function() {
      var scroll = $(window).scrollTop();
      var box = $('.header-text').height();
      var header = $('header').height();

      if (scroll >= box - header) {
        $("header").addClass("background-header");
      } else {
        $("header").removeClass("background-header");
      }
    });
    
    if ($('.owl-clients').length) {
        $('.owl-clients').owlCarousel({
            loop: true,
            nav: false,
            dots: true,
            items: 1,
            margin: 30,
            autoplay: false,
            smartSpeed: 700,
            autoplayTimeout: 6000,
            responsive: {
                0: {
                    items: 1,
                    margin: 0
                },
                460: {
                    items: 1,
                    margin: 0
                },
                576: {
                    items: 2,
                    margin: 20
                },
                992: {
                    items: 3,
                    margin: 30
                }
            }
        });
    }

    if ($('.owl-banner').length) {
        $('.owl-banner').owlCarousel({
            loop: true,
            nav: false,
            dots: true,
            items: 1,
            margin: 0,
            autoplay: false,
            smartSpeed: 700,
            autoplayTimeout: 6000,
            responsive: {
                0: {
                    items: 1,
                    margin: 0
                },
                460: {
                    items: 1,
                    margin: 0
                },
                576: {
                    items: 1,
                    margin: 20
                },
                992: {
                    items: 1,
                    margin: 30
                }
            }
        });
    }

    // ✅ Função de pesquisa sem duplicação de jQuery
    function pesquisarCarros() {
        let searchInput = document.getElementById("searchInput");
        if (!searchInput) return;

        let termoPesquisa = searchInput.value.toLowerCase().trim();
        if (termoPesquisa === "") {
            alert("Digite algo para pesquisar!");
            return;
        }

        let encontrou = false;
        let carros = document.querySelectorAll(".product-item");

        if (carros.length === 0) {
            console.warn("Nenhum carro carregado ainda!");
            return;
        }

        carros.forEach((carro) => {
            let nomeCarro = carro.querySelector(".carro-nome h4");
            if (!nomeCarro) return;

            let nomeTexto = nomeCarro.textContent.toLowerCase().trim();
            console.log("Nome encontrado:", nomeTexto);

            if (nomeTexto.includes(termoPesquisa)) {
                carro.style.display = "block";
                encontrou = true;
            } else {
                carro.style.display = "none";
            }
        });

        if (!encontrou) {
            alert("Nenhum carro encontrado!");
            carros.forEach((carro) => carro.style.display = "block");
        }
    }

    function aguardarElementos(tentativas = 10) {
        let searchButton = document.getElementById("searchButton");
        let searchInput = document.getElementById("searchInput");
        let carros = document.querySelectorAll(".product-item");

        if (!searchButton || !searchInput || carros.length === 0) {
            if (tentativas > 0) {
                console.warn(`Elementos ainda não carregados, tentando novamente... (${tentativas} tentativas restantes)`);
                setTimeout(() => aguardarElementos(tentativas - 1), 1000); // Tenta de novo em 1 segundo
            } else {
                console.error("Os elementos não carregaram a tempo. Verifique se os carros estão sendo carregados corretamente.");
            }
            return;
        }

        searchButton.addEventListener("click", pesquisarCarros);
        searchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                pesquisarCarros();
            }
        });

        console.log("Eventos adicionados corretamente!");
    }

    // Espera no máximo 10 segundos pelos elementos
    aguardarElementos();
});