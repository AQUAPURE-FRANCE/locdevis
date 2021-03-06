import '../scss/app.scss';
import {QuotationModule} from "./quotation_module";

/*
 * Code on add page
 */
if (QuotationModule.getParamFromURL('add') !== null && QuotationModule.getParamFromURL('add').length === 1) {
    // Récupère le chemin du JSON par l'id 'js-data'
    let url = document.getElementById('js-data').dataset.source;

    // Attention à l'ordre de l'exécution des fonctions !

    /**
     * Fonction principale => HTTP Request
     * url type=string
     * callback
     * path type=string
     * dataFetch type=bool
     * autocomplete = []
     */
    QuotationModule.getData(
        url,
        QuotationModule.getData,
        QuotationModule.getCustomersURL(),
        null,
        true,
        []
    );

    /**
     * Fonction qui récupère les données dans le data-customer.js
     * Met aussi en parallèle en place l'autocomplétion
     * callback
     * path type=string
     * dataFetch type=bool
     * autocomplete = [(string) selector, (string) name, (int) minLength]
     */
    QuotationModule.getData(
        QuotationModule.getCustomersURL(),
        QuotationModule.autocomplete,
        null,
        null,
        true,
        ['#quotation_customer_customerId', 'customers', 1]
    );

    let urlSearchCustomers = document.querySelector('[data-searchcustomers]').dataset.searchcustomers;

    // On récupère le nom du dossier admin
    let adminFolderName = window.location.pathname;
    adminFolderName = adminFolderName.split("/");
    adminFolderName = adminFolderName[adminFolderName.length - 6];

    const getQuery = (Event) => {

        let query = Event.currentTarget.value !== ' ' || Event.currentTarget.value !== '' ?
            Event.currentTarget.value.replace(/\s(?=\w)(\w)+/, '') : false;

        const insertCustomerInDOM = (customers) => {
            let output = '';
            let modalCustomerInfos = '';

            // Build show customer link based on his id.
            // Exemple: http://localhost:8000/adminToua/index.php/modules/quotation/admin/show/customer/2
            let link = window.location.origin + '/' + adminFolderName + '/index.php/modules/quotation/admin/show/customer/';
            let show = window.location.origin + '/' + adminFolderName + 'index.php/sell/customers/';

            customers.forEach((customer, i) => {

                import('./templates_module').then(mod => {

                    modalCustomerInfos += mod.TemplateModule.modalCustomerInfos
                        .replace(/---id-customer-modal---/, customer.id_customer)
                        .replace(/---id-customer-orders---/, customer.id_customer)
                        .replace(/---id-customer-carts---/, customer.id_customer)
                        .replace(/---id-customer-addresses---/, customer.id_customer)
                        .replace(/---personal-datas---/,
                            mod.TemplateModule.personalData.replace(/---id-customer-modal---/, customer.id_customer))
                        .replace(/---customer-orders---/,
                            mod.TemplateModule.customerOrders.replace(/---id-customer-orders---/, customer.id_customer))
                        .replace(/---customer-carts---/,
                            mod.TemplateModule.customerCarts.replace(/---id-customer-carts---/, customer.id_customer))
                        .replace(/---customer-addresses---/,
                            mod.TemplateModule.customerAddresses.replace(/---id-customer-addresses---/, customer.id_customer));

                    output += mod.TemplateModule.card
                        .replace(/---increment---/, i)
                        .replace(/---fullname---/, customer.lastname + customer.firstname)
                        .replace(/---lastname---/, customer.lastname)
                        .replace(/---firstname---/, customer.firstname)
                        .replace(/---customer-id---/, customer.id_customer)
                        .replace(/---email---/, customer.email)
                        .replace(/---birthday---/, customer.birthday)
                        .replace(/---id-customer-modal---/, customer.id_customer)
                        .replace(/---link-show-customer---/, link + customer.id_customer)
                        .replace(/---link-show-customer-carts---/, link + customer.id_customer + '/details')
                        .replace(/---id---/, customer.id_customer)
                        .replace(/---id-customer---/, customer.id_customer)
                        .replace(/---modal-customer-infos---/, modalCustomerInfos);


                    if (customers.length - 1 === i) {
                        document.getElementById('js-output-customers').innerHTML = output;

                        let urlCustomerShow = document.querySelector('[data-customershow]').dataset.customershow;
                        let newUrlCustomerShow;

                        if (document.querySelectorAll('button.customer-show') !== null) {
                            // On boucle sur chaque élément link auquel on attache l'évènement clic
                            document.querySelectorAll('button.customer-show').forEach(function (link) {
                                link.addEventListener('click', function (Event) {
                                    newUrlCustomerShow = window.location.origin + urlCustomerShow
                                        .replace(/\d+(?=\?_token)/, link.dataset.idcustomer);

                                    const getCustomerShow = (customer) => {

                                        let addressController = window.location.origin + '/' + adminFolderName + '/index.php/?controller=AdminAddresses';

                                        let personalData = '';
                                        let tableCustomerOrders = '';
                                        let customerOrders = '';
                                        let tableCustomerCarts = '';
                                        let customerCarts = '';
                                        let tableCustomerAddresses = '';
                                        let customerAddresses = '';

                                        personalData = mod.TemplateModule.personalData
                                            .replace(/---firstname---/, customer.firstname)
                                            .replace(/---lastname---/, customer.lastname)
                                            .replace(/---id-customer---/, customer.id_customer)
                                            .replace(/---customer-link-email---/, 'mailto:' + customer.email)
                                            .replace(/---customer-email---/, customer.email)
                                            .replace(/---edit---/, show + customer.id_customer + '/edit')
                                            .replace(/---gender---/, customer.title)
                                            .replace(/---old---/, Math.floor(customer.old))
                                            .replace(/---birthday---/, customer.birthday)
                                            .replace(/---registration---/, customer.registration)
                                            .replace(/---lang---/, customer.lang)
                                            .replace(/---last-update---/, customer.last_update)
                                            .replace(/---badge-newsletter---/, (customer.newsletter === '1' ? 'badge-success' : 'badge-danger'))
                                            .replace(/---icon-newsletter---/, (customer.newsletter === '1' ? 'check' : 'cancel'))
                                            .replace(/---badge-partners---/, (customer.offer_partners === '1' ? 'badge-success' : 'badge-danger'))
                                            .replace(/---icon-partners---/, (customer.offer_partners === '1' ? 'check' : 'cancel'))
                                            .replace(/---badge-is-active---/, (customer.active === '1' ? 'badge-success' : 'badge-danger')).replace(/---icon-is-active---/, (customer['active'] === '1' ? 'check' : 'cancel'))
                                            .replace(/---is-active---/, (customer.active === 1 ? 'Activé' : 'Désactivé'));

                                        for (let order of customer['orders']) {
                                            tableCustomerOrders += mod.TemplateModule.tableCustomerOrders
                                                .replace(/---id-order---/, order.id_order)
                                                .replace(/---date-order---/, order.date_order)
                                                .replace(/---order-payment---/, order.payment)
                                                .replace(/---order-status---/, order.order_status)
                                                .replace(/---nb-products---/, order['nb_products'].nb_products)
                                                .replace(/---order-total-paid---/, order.total_paid + ' €');
                                        }

                                        customerOrders = mod.TemplateModule.customerOrders
                                            .replace(/---nb-orders---/, customer.nb_orders)
                                            .replace(/---table-customer-orders---/, tableCustomerOrders);

                                        for (let cart of customer['carts']) {
                                            tableCustomerCarts += mod.TemplateModule.tableCustomerCarts
                                                .replace(/---id-cart---/, cart.id_cart)
                                                .replace(/---date-cart---/, cart.date_cart)
                                                .replace(/---transporter---/, cart.carrier)
                                                .replace(/---price---/, cart.total_cart + ' €')
                                            ;
                                        }

                                        customerCarts = mod.TemplateModule.customerCarts
                                            .replace(/---nb-carts---/, customer['nb_carts'].nb_carts)
                                            .replace(/---table-customer-carts---/, tableCustomerCarts);

                                        for (let address of customer['addresses']) {
                                            tableCustomerAddresses += mod.TemplateModule.tableCustomerAddresses
                                                .replace(/---company---/, address.company)
                                                .replace(/---firstname---/, address.firstname)
                                                .replace(/---lastname---/, address.lastname)
                                                .replace(/---address---/, address.address)
                                                .replace(/---further-address---/, address.further_address)
                                                .replace(/---postcode---/, address.postcode)
                                                .replace(/---city---/, address.city)
                                                .replace(/---country---/, address.country)
                                                .replace(/---phone-number---/, address.phone);
                                        }

                                        customerAddresses = mod.TemplateModule.customerAddresses
                                            .replace(/---add-address---/, addressController + '&id_customer=' + customer.id_customer + '&addaddress=1')
                                            .replace(/---table-customer-addresses---/, tableCustomerAddresses);

                                        document.getElementById('modal-personal-data-infos_' + customer.id_customer).innerHTML = personalData;
                                        document.getElementById('modal-customer-orders_' + customer.id_customer).innerHTML = customerOrders;
                                        document.getElementById('modal-customer-carts_' + customer.id_customer).innerHTML = customerCarts;
                                        document.getElementById('modal-customer-addresses_' + customer.id_customer).innerHTML = customerAddresses;
                                    };

                                    QuotationModule.getData(
                                        newUrlCustomerShow,
                                        getCustomerShow,
                                        null,
                                        null,
                                        true,
                                        []
                                    );

                                })
                            })
                        }

                        // Initialisation de la variable urlCustomersDetails qui prend l'élément data-customerdetails du fichier add_quotation.html.twig
                        let urlCustomersDetails = document.querySelector('[data-customerdetails]').dataset.customerdetails;
                        let newUrlCustomersDetails;
                        let linkCart = window.location.origin + '/' + adminFolderName + '/index.php/modules/quotation/admin/show/cart/';
                        let urlCart = document.querySelector('[data-customercart]').dataset.customercart;
                        let newUrlCart;

                        // document.querySelectorAll renvoie tous les éléments du document qui correspondent à un sélecteur CSS, ici, tous les éléments a de la class customer-details
                        if (document.querySelectorAll('a.customer-details') !== null) {
                            // On boucle sur chaque élément link auquel on attache l'évènement clic
                            document.querySelectorAll('a.customer-details').forEach(function (link) {
                                link.addEventListener('click', function (Event) {
                                    // Annule le comportement par défaut de l'événement, ici empeche le lien d'ouvrir l'url quotation/admin/show/customer/{id_customer}/details
                                    Event.preventDefault();
                                    // La méthode closest renvoie l'élément parent le plus proche de l'élément courant (ici id customer-card_ est le plus proche de la class hidden)
                                    // La méthode toggle permet de masquer ou d'afficher le paramètre hidden à l'élément class
                                    Event.currentTarget.closest('.hidden').classList.toggle('hidden');
                                    // Pour chaque cards qui aura la class hidden, ces dernières seront en display-none
                                    document.querySelectorAll('.hidden').forEach(function (card, index) {
                                        card.classList.add('d-none');
                                    });

                                    /*
                                     * window.location.origin renvoie le protocole, le nom d'hôte et le numéro de port d'une URL
                                     * (ici en dev http://localhost:8000, en prod, ce sera le nom de domaine)
                                     */

                                    newUrlCustomersDetails = window.location.origin + urlCustomersDetails
                                        // On récupére l'id_customer (par défaut 0 ici) avec le regex et on le remplace par l'id_customer selectionné du lien
                                        .replace(/\d+(?=\/details)/, link.dataset.idcustomer);

                                    const getCustomerDetails = (data) => {
                                        let outputCart = '';
                                        let outputOrder = '';
                                        let outputQuotation = '';
                                        let modalCustomerDetails = '';
                                        let modalCustomerDetailsCart = '';
                                        let modalCustomerOrderDetails = '';
                                        let modalCustomerOrderDetailsCart = '';
                                        let modalCustomerQuotationDetails = '';
                                        let modalCustomerQuotationDetailsCart = '';
                                        let selectAddress = '';
                                        let addressSelected = '';
                                        let picturePath = window.location.origin + '/img/p/';

                                        /*
                                        * Cart section
                                        */

                                        // L'instruction for...of permet de créer une boucle d'un array qui parcourt un objet itérable
                                        // Attention à l'ordre d'éxécution des boucles, on éxecute dans cartData, ensuite dans modalCartInfos et enfin tableCart
                                        for (let cart of data['carts']) {

                                            for (let product of cart['products']) {

                                                // TemplateModule.cartData correspond à cartData dans le fichier templates_module.js
                                                modalCustomerDetailsCart += mod.TemplateModule.cartData
                                                    .replace(/---productPicture---/, picturePath + product.path.join('/') + '/' + product.id_image + '-cart_default.jpg')
                                                    .replace(/---productName---/, product.product_name)
                                                    .replace(/---productAttribute---/, product.attributes)
                                                    .replace(/---productPrice---/, product.product_price + ' €')
                                                    .replace(/---productQuantity---/, product.product_quantity)
                                                    .replace(/---totalProduct---/, product.total_product + ' €');
                                            }


                                            modalCustomerDetails += mod.TemplateModule.modalCartInfos
                                                .replace(/---id-cart-modal---/, cart.id_cart)
                                                .replace(/---id-cart-link---/, cart.id_cart)
                                                .replace(/---firstname---/, cart.firstname)
                                                .replace(/---lastname---/, cart.lastname)
                                                .replace(/---id-customer---/, cart.id_customer)
                                                .replace(/---id-cart---/, cart.id_cart)
                                                .replace(/---cart-data---/, modalCustomerDetailsCart)
                                                .replace(/---totalCart---/, cart.total_cart + ' €');

                                            // Une fois les boucles effectuées, on vide la modalCustomerDetailsCart
                                            modalCustomerDetailsCart = '';
                                        }

                                        for (let customer of data['carts']) {
                                            if (customer.orders.length === 0) {
                                                outputCart += mod.TemplateModule.tableCart
                                                    .replace(/---idCustomer---/, customer.id_customer)
                                                    .replace(/---cartId---/, customer.id_cart)
                                                    .replace(/---idNewCart---/, data.id_last_cart)
                                                    .replace(/---cartDate---/, customer.date_cart)
                                                    .replace(/---totalCart---/, customer.total_cart + ' €')
                                                    .replace(/---id-cart-modal---/, customer.id_cart)
                                                    .replace(/---id---/, customer.id_cart)
                                                    .replace(/---link-show-customer-cart-use---/, linkCart + customer.id_cart)
                                                    .replace(/---token---/, new URL(window.location.href).searchParams.get('_token'));
                                            }
                                        }

                                        document.getElementById('tableCart').insertAdjacentHTML('afterend', modalCustomerDetails);

                                        /*
                                         * Order section
                                         */

                                        for (let cart of data['carts']) {

                                            for (let product of cart['products']) {

                                                // Etant donné que les produits d'un panier sont déjà récupérés, on va réutiliser le template correspondant, ici TemplateModule.cartData
                                                modalCustomerOrderDetailsCart += mod.TemplateModule.cartData
                                                    .replace(/---productPicture---/, picturePath + product.path.join('/') + '/' + product.id_image + '-cart_default.jpg')
                                                    .replace(/---productName---/, product.product_name)
                                                    .replace(/---productAttribute---/, product.attributes)
                                                    .replace(/---productPrice---/, product.product_price + ' €')
                                                    .replace(/---productQuantity---/, product.product_quantity)
                                                    .replace(/---totalProduct---/, product.total_product + ' €');
                                            }

                                            for (let order of cart['orders']) {

                                                modalCustomerOrderDetails += mod.TemplateModule.modalCartOrderInfos
                                                    .replace(/---id-order-modal---/, order.id_order)
                                                    .replace(/---firstname---/, order.firstname)
                                                    .replace(/---lastname---/, order.lastname)
                                                    .replace(/---id-customer---/, order.id_customer)
                                                    .replace(/---address1---/, order.address1)
                                                    .replace(/---address2---/, order.address2)
                                                    .replace(/---postcode---/, order.postcode)
                                                    .replace(/---city---/, order.city)
                                                    .replace(/---id-order---/, order.id_order)
                                                    .replace(/---reference---/, order.order_reference)
                                                    .replace(/---orderStatus---/, order.order_status)
                                                    .replace(/---id-cart---/, order.id_cart)
                                                    .replace(/---totalProducts---/, order.total_products + ' €')
                                                    .replace(/---totalDiscounts---/, cart.total_discounts + ' €')
                                                    .replace(/---totalShipping---/, order.total_shipping + ' €')
                                                    .replace(/---totaltaxes---/, cart.total_taxes + ' €')
                                                    .replace(/---totalPaid---/, order.total_paid + ' €')
                                                    .replace(/---order-cart-data---/, modalCustomerOrderDetailsCart);
                                            }

                                            modalCustomerOrderDetailsCart = '';
                                        }

                                        for (let customer of data['orders']) {
                                            if (typeof customer.id_order !== 'undefined') {
                                                outputOrder += mod.TemplateModule.tableOrder
                                                    .replace(/---orderId---/, customer.id_order)
                                                    .replace(/---orderDate---/, customer.date_order)
                                                    .replace(/---totalOrder---/, customer.total_paid + ' €')
                                                    .replace(/---payment---/, customer.payment)
                                                    .replace(/---orderStatus---/, customer.order_status)
                                                    .replace(/---id-order-modal---/, customer.id_order)
                                                    .replace(/---idCustomer---/, customer.id_customer)
                                                    .replace(/---id---/, customer.id_cart)
                                                    .replace(/---idNewCart---/, data.id_last_cart)
                                                    .replace(/---token---/, new URL(window.location.href).searchParams.get('_token'))
                                                    .replace(/---link-show-customer-cart-use---/, linkCart + customer.id_cart);
                                            }
                                        }

                                        document.getElementById('tableOrder').insertAdjacentHTML('afterend', modalCustomerOrderDetails);

                                        /*
                                        * Quotation section
                                         */
                                        for (let cart of data['carts']) {

                                            for (let product of cart['products']) {

                                                modalCustomerQuotationDetailsCart += mod.TemplateModule.cartData
                                                    .replace(/---productPicture---/, picturePath + product.path.join('/') + '/' + product.id_image + '-cart_default.jpg')
                                                    .replace(/---productName---/, product.product_name)
                                                    .replace(/---productAttribute---/, product.attributes)
                                                    .replace(/---productPrice---/, product.product_price + ' €')
                                                    .replace(/---productQuantity---/, product.product_quantity)
                                                    .replace(/---totalProduct---/, product.total_product + ' €');
                                            }

                                            for (let quotation of cart['quotations']) {

                                                modalCustomerQuotationDetails += mod.TemplateModule.modalCartQuotationInfos
                                                    .replace(/---id-quotation-modal---/, quotation.id_quotation)
                                                    .replace(/---firstname---/, cart.firstname)
                                                    .replace(/---lastname---/, cart.lastname)
                                                    .replace(/---id-customer---/, cart.id_customer)
                                                    .replace(/---id-quotation---/, quotation.id_quotation)
                                                    .replace(/---reference---/, quotation.quotation_reference)
                                                    .replace(/---id-cart---/, quotation.id_cart)
                                                    .replace(/---totalQuotation---/, quotation.total_quotation + ' €')
                                                    .replace(/---totalDiscounts---/, cart.total_discounts + ' €')
                                                    .replace(/---totaltaxes---/, cart.total_taxes + ' €')
                                                    .replace(/---totalTTC---/, cart.total_ttc + ' €')
                                                    .replace(/---quotation-cart-data---/, modalCustomerQuotationDetailsCart);
                                            }

                                            modalCustomerQuotationDetailsCart = '';
                                        }

                                        for (let customer of data['quotations']) {
                                            if (typeof customer.id_quotation !== 'undefined') {
                                                outputQuotation += mod.TemplateModule.tableQuotation
                                                    .replace(/---quotationId---/, customer.id_quotation)
                                                    .replace(/---quotationDate---/, customer.date_quotation)
                                                    .replace(/---totalQuotation---/, customer.total_ttc + ' €')
                                                    .replace(/---id-quotation-modal---/, customer.id_quotation)
                                                    .replace(/---idCustomer---/, customer.id_customer)
                                                    .replace(/---id---/, customer.id_cart)
                                                    .replace(/---idNewCart---/, data.id_last_cart)
                                                    .replace(/---token---/, new URL(window.location.href).searchParams.get('_token'))
                                                    .replace(/---link-show-customer-cart-use---/, linkCart + customer.id_cart);
                                            }
                                        }

                                        document.getElementById('tableQuotation').insertAdjacentHTML('afterend', modalCustomerQuotationDetails);

                                        /**
                                         * La propriété innerHTML définit ou retourne le contenu HTML d'un élément,
                                         * ici permet d'afficher le contenu de outputCart dans l'élément <tbody id="output-customer-carts"> du fichier add_quotation.html.twig
                                         */

                                        document.getElementById('output-customer-carts').innerHTML = outputCart;
                                        document.getElementById('output-customer-orders').innerHTML = outputOrder;
                                        document.getElementById('output-customer-quotations').innerHTML = outputQuotation;

                                        // Implement 'Utiliser' button here to take benefit of table displaying carts, orders and quotations

                                        /*
                                         * cart to use
                                         */

                                        if (document.querySelectorAll('a.customer-cart-to-use') !== null) {
                                            document.querySelectorAll('a.customer-cart-to-use').forEach(function (link) {
                                                link.addEventListener('click', function (Event) {
                                                    Event.preventDefault();

                                                    let idCustomer = document.querySelector('a.customer-cart-to-use').dataset.idcustomer;
                                                    let idOldCart = Event.currentTarget.closest('td').querySelector('a.customer-cart-to-use').dataset.idcart;
                                                    let idNewCart = document.querySelector('a.customer-cart-to-use').dataset.idnewcart;
                                                    let token = document.querySelector('a.customer-cart-to-use').dataset.token;

                                                    /*
                                                     * Duplicate cart to create new cart
                                                     */
                                                    let paramsUrlToDuplicateCart = '';

                                                    paramsUrlToDuplicateCart = '/' +
                                                        idCustomer + '/' +
                                                        idOldCart + '/' +
                                                        idNewCart + '?' +
                                                        "_token=" + token;

                                                    let urlDuplicateCart = window.location.origin + '/' + adminFolderName + '/index.php/modules/quotation/admin/duplicate/cart' + paramsUrlToDuplicateCart;

                                                    const getNewCartByDuplicateCart = (cart) => document.getElementById('add-product-to-cart').dataset.idcart = data.id_last_cart;

                                                    QuotationModule.getData(
                                                        urlDuplicateCart,
                                                        getNewCartByDuplicateCart,
                                                        null,
                                                        'POST',
                                                        true,
                                                        []
                                                    );

                                                    /*
                                                     * Show cart
                                                     */

                                                    newUrlCart = window.location.origin + urlCart
                                                        .replace(/\d+(?=\?_token)/, link.dataset.idnewcart);

                                                    const getCustomerCartToUse = (cart) => {
                                                        let picture = window.location.origin + '/img/p/';
                                                        let outputCartToUse = '';
                                                        let outputCartProductsToUse = '';

                                                        for (let product of cart['products']) {
                                                            outputCartProductsToUse += mod.TemplateModule.quotationCartProducts
                                                                .replace(/---picture---/, picture + product.path.join('/') + '/' + product.id_image + '-cart_default.jpg')
                                                                .replace(/---idProduct---/, product.id_product)
                                                                .replace(/---idProductAttribute---/, product.id_product_attribute)
                                                                .replace(/---productName---/, product.product_name)
                                                                .replace(/---idProdAttr---/, product.id_product_attribute)
                                                                .replace(/---idProd---/, product.id_product)
                                                                .replace(/---productAttribute---/, product.attributes)
                                                                .replace(/---productPrice---/, product.product_price + ' €')
                                                                .replace(/---productTaxe---/, product.tva_amount_product)
                                                                .replace(/---productQuantity---/, product.product_quantity)
                                                                .replace(/---totalProductTaxe---/, product.total_tva_amount_product)
                                                                .replace(/---totalProduct---/, product.total_product + ' €');
                                                        }

                                                        outputCartToUse += mod.TemplateModule.quotationCart
                                                            .replace(/---totalCartTaxes---/, cart['total_taxes'] + ' €')
                                                            .replace(/---totalCart---/, cart['total_cart'] + ' €');

                                                        document.getElementById('output-cart-products-to-use').innerHTML = outputCartProductsToUse;
                                                        document.getElementById('output-cart-to-use').innerHTML = outputCartToUse;

                                                        /*
                                                         * Show cart_summary
                                                         */
                                                        let outputCartSummaryTotalProducts = '';
                                                        let outputCartSummaryTotalTaxes = '';
                                                        let outputCartSummaryTotalCartWithoutTaxes = '';
                                                        let outputCartSummaryTotalCartWithTaxes = '';

                                                        let cartSummaryTotalProducts = document.getElementById('cart_summary_total_products');
                                                        let cartSummaryTotalTaxes = document.getElementById('cart_summary_total_taxes');
                                                        let cartSummaryTotalWithoutTaxes = document.getElementById('cart_summary_total_without_taxes');
                                                        let cartSummaryTotalWithTaxes = document.getElementById('cart_summary_total_with_taxes');

                                                        outputCartSummaryTotalProducts = mod.TemplateModule.cartSummaryTotalProducts.replace(/---totalProducts---/,
                                                            document.getElementById('total_cart').textContent);
                                                        outputCartSummaryTotalTaxes = mod.TemplateModule.cartSummaryTotalTaxes.replace(/---totalTaxesCartSummary---/,
                                                            document.getElementById('total_cart_taxes').textContent);
                                                        outputCartSummaryTotalCartWithoutTaxes = mod.TemplateModule.cartSummaryTotalWithoutTaxes.replace(/---totalCartWithoutTaxes---/,
                                                            document.getElementById('total_cart').textContent);

                                                        cartSummaryTotalProducts.innerHTML = outputCartSummaryTotalProducts;
                                                        cartSummaryTotalTaxes.innerHTML = outputCartSummaryTotalTaxes;
                                                        cartSummaryTotalWithoutTaxes.innerHTML = outputCartSummaryTotalCartWithoutTaxes;

                                                        let cartSummaryTotalTaxesValue = parseFloat(cartSummaryTotalTaxes.textContent.split(' ')[0]);
                                                        let cartSummaryTotalWithoutTaxesValue = parseFloat(cartSummaryTotalWithoutTaxes.textContent.split(' ')[0]);
                                                        let cartSummaryTotalWithTaxesValue = parseFloat(cartSummaryTotalTaxesValue + cartSummaryTotalWithoutTaxesValue).toFixed(2);

                                                        outputCartSummaryTotalCartWithTaxes = mod.TemplateModule.cartSummaryTotalWithTaxes.replace(/---totalCartWithTaxes---/, cartSummaryTotalWithTaxesValue + ' €');
                                                        cartSummaryTotalWithTaxes.innerHTML = outputCartSummaryTotalCartWithTaxes;
                                                    };

                                                    /*
                                                    * Fonction qui récupère les données dans le json via le path 'quotation_admin_show_cart' dans le fichier _cart.html.twig
                                                    */
                                                    QuotationModule.getData(
                                                        newUrlCart,
                                                        getCustomerCartToUse,
                                                        null,
                                                        null,
                                                        true,
                                                        []
                                                    );

                                                    // On affiche le récapitulatif du panier
                                                    document.getElementById('js-output-cart-summary').classList.replace('d-none', 'd-block');
                                                    // On récupère le style du form-control
                                                    document.getElementById('quotation_status_status').classList.replace('custom-select', 'form-control');
                                                });
                                            });
                                        }

                                        // on ajoute l'attribut data-idcustomer à l'élément html add-product-to-cart pour récupérer l'id_customer qui nous servira pour la section search product section
                                        document.getElementById('add-product-to-cart').setAttribute('data-idcustomer', data['customer'].id_customer);
                                        // on ajoute l'attribut data-customername à l'élément html add-product-to-cart pour récupérer le fullname qui nous servira pour la reference du devis lors de la création de celui-ci
                                        document.getElementById('add-product-to-cart').setAttribute('data-customername', data['customer'].lastname + data['customer'].firstname);
                                        // on ajoute l'attribut data-idcart à l'élément html add-product-to-cart
                                        document.getElementById('add-product-to-cart').setAttribute('data-idcart', data.id_last_cart);
                                        // on ajoute l'attribut data-idquotation à l'élément html add-product-to-cart
                                        document.getElementById('add-product-to-cart').setAttribute('data-idquotation', data.id_last_quotation);
                                        // On ajoute l'attribut data-idcart à l'élément id output-discounts
                                        document.getElementById('output-discounts').setAttribute('data-idcart', data.id_last_cart);

                                        /**
                                         * Addresses block
                                         */

                                        let addresses = data['addresses'];

                                        // placeholder, 1st option of the select
                                        selectAddress = mod.TemplateModule.placeholderAddress;

                                        // obtenir la liste des alias d'addresses dans les 2 selects
                                        for (let addressList of addresses) {
                                            selectAddress += mod.TemplateModule.selectAddress
                                                .replace(/---id-address---/, addressList.id_address)
                                                .replace(/---alias---/, addressList.alias)
                                        }

                                        // remplir le block par l'addresse de livraison sélectionnée
                                        if (document.querySelectorAll('.address-delivery') !== null) {
                                            document.querySelectorAll('.address-delivery').forEach(function (link) {
                                                link.addEventListener('change', function (Event) {

                                                    // filter (fonction js de base) permet de récupérer l'objet dont la value de l'option est égale à l'id_address
                                                    for (let address of addresses.filter(address => address.id_address === link.value)) {
                                                        addressSelected = mod.TemplateModule.addressSelected
                                                            .replace(/---firstname---/, address.firstname)
                                                            .replace(/---lastname---/, address.lastname)
                                                            .replace(/---company---/, address.company)
                                                            .replace(/---address---/, address.address)
                                                            .replace(/---further_address---/, address.further_address)
                                                            .replace(/---postcode---/, address.postcode)
                                                            .replace(/---city---/, address.city)
                                                            .replace(/---country---/, address.country)
                                                            .replace(/---phone---/, address.phone);
                                                    }

                                                    document.getElementById('address-delivery-selected').innerHTML = addressSelected;
                                                })
                                            })
                                        }

                                        if (document.querySelectorAll('.address-invoice') !== null) {
                                            document.querySelectorAll('.address-invoice').forEach(function (link) {
                                                link.addEventListener('change', function (Event) {

                                                    for (let address of addresses.filter(address => address.id_address === link.value)) {
                                                        addressSelected = mod.TemplateModule.addressSelected
                                                            .replace(/---firstname---/, address.firstname)
                                                            .replace(/---lastname---/, address.lastname)
                                                            .replace(/---company---/, address.company)
                                                            .replace(/---address---/, address.address)
                                                            .replace(/---further_address---/, address.further_address)
                                                            .replace(/---postcode---/, address.postcode)
                                                            .replace(/---city---/, address.city)
                                                            .replace(/---country---/, address.country)
                                                            .replace(/---phone---/, address.phone);
                                                    }

                                                    document.getElementById('address-invoice-selected').innerHTML = addressSelected;
                                                })
                                            })
                                        }

                                        document.getElementById('address-delivery').innerHTML = selectAddress;
                                        document.getElementById('address-invoice').innerHTML = selectAddress;
                                    };

                                    /*
                                     * Fonction qui récupère les données dans le json via le path 'quotation_admin_show_customer_details'
                                     */

                                    QuotationModule.getData(
                                        newUrlCustomersDetails,
                                        getCustomerDetails,
                                        null,
                                        null,
                                        true,
                                        []
                                    );

                                    // Ici, on récupère la class 'd-none' de l'élément id 'js-output-customer-details' et on la remplace par 'd-block'
                                    document.getElementById('js-output-customer-details').classList.replace('d-none', 'd-block');
                                    document.getElementById('js-output-cart-infos').classList.replace('d-none', 'd-block');
                                    document.getElementById('js-output-discount-infos').classList.replace('d-none', 'd-block');
                                    document.getElementById('js-output-address').classList.replace('d-none', 'd-block');
                                });
                            });
                        }
                    }
                });
            });
        };

        QuotationModule.getData(
            urlSearchCustomers.replace(/query/, Event.currentTarget.value),
            insertCustomerInDOM,
            null,
            null,
            true,
            []
        );
    };

    const inputSearchCustomers = document.getElementById('quotation_customer_customerId');
    ['keyup', 'change'].forEach(event => {
        inputSearchCustomers.addEventListener(event, getQuery, false);

    });

    /*
     *Search product section
     */
    let urlProduct = document.getElementById('js-data-product').dataset.source;

    QuotationModule.getData(
        urlProduct,
        QuotationModule.getData,
        QuotationModule.getProductsURL(),
        null,
        true,
        []
    );

    QuotationModule.getData(
        QuotationModule.getProductsURL(),
        QuotationModule.autocomplete,
        null,
        null,
        true,
        ['#quotation_product_cartId', 'products', 2]
    );

    const getQueryProduct = (Event) => {
        if (typeof parseInt(Event.currentTarget.value.replace(/[^(\d)+(\s){1}]/, '').trim()) === "number" &&
            // Number.isNaN() permet de déterminer si la valeur passée en argument est NaN
            !Number.isNaN(parseInt(Event.currentTarget.value.replace(/[^(\d)+(\s){1}]/, '').trim()))
        ) {
            // Get route 'quotation_admin_search_attributes_product'
            let urlSearchAttributesProduct = document.getElementById('js-data-product').dataset.sourceattributes;

            // La fonction parseInt() analyse une chaîne de caractère fournie en argument et renvoie un entier exprimé dans une base donnée
            let idProduct = parseInt(Event.currentTarget.value.replace(/[^(\d)+(\s){1}]/, '').trim());
            urlSearchAttributesProduct = window.location.origin + urlSearchAttributesProduct.replace(/\d+(?=\?_token)/, idProduct);
            document.getElementById('js-output-attributes-products');

            const getAttributesProduct = (attributes) => {
                let index = 0;
                let selectProductAttributes = document.getElementById('js-output-attributes-products');
                let quantityInStock = document.getElementById('quantity-in-stock');
                let sectionProductAttributes = document.getElementById('section-attributes-product');
                let formAddProductToCart = document.getElementById('add-product-to-cart');

                // On cherche si l'id_product_attribute = 0
                if (attributes.id_product_attribute === '0') {
                    // On calcule la longueur du select et de ces options
                    if (selectProductAttributes.length > 0) {
                        // Si le tableau existe, on créé des options auquel on attribut la valeur à 0 et on les cache
                        for (let i = 0; i < selectProductAttributes.length; i++) {
                            selectProductAttributes[i] = new Option('', attributes.id_product_attribute, i === 0);
                            selectProductAttributes[i].hidden = true;
                        }
                        // On ajoute l'attribut data-idproduct auquel on affecte l'id_product au form
                        formAddProductToCart.setAttribute('data-idproduct', attributes.id_product);
                    }
                    // Create attribute id_product on form.add-product-to-cart
                    formAddProductToCart.setAttribute('data-idproduct', attributes.id_product);
                    // Create attribute id_product_attribute on form.add-product-to-cart
                    formAddProductToCart.setAttribute('data-idproductattribute', attributes.id_product_attribute);
                    sectionProductAttributes.classList.replace('d-flex', 'd-none'); // Hide select section
                } else {
                    for (let product of attributes) {
                        selectProductAttributes[index] = new Option(product.attributes, product.id_product_attribute, false, false);
                        selectProductAttributes[index].setAttribute('data-instock', product.quantity);
                        selectProductAttributes[index].setAttribute('data-idproduct', product.id_product);

                        // Create attribute id_product on form.add-product-to-cart
                        formAddProductToCart.setAttribute('data-idproduct', product.id_product);
                        // Remove attribute id_product_attribute on form.add-product-to-cart
                        formAddProductToCart.removeAttribute('data-idproductattribute', attributes.id_product_attribute);
                        sectionProductAttributes.classList.replace('d-none', 'd-flex');

                        if (index === 0 || typeof product.attributes === 'undefined') {
                            quantityInStock.innerHTML = product.quantity;
                        }
                        index++;
                    }

                    // Remove attributes not belonging to current product
                    let count = attributes.length !== selectProductAttributes.length ? Math.max(attributes.length, selectProductAttributes.length) : false;

                    if (count) {
                        for (let i = 0; i < count; i++) {
                            if (selectProductAttributes[i].dataset.idproduct !== formAddProductToCart.dataset.idproduct) {
                                selectProductAttributes[i].hidden = true;
                            }
                        }
                    }
                }

                selectProductAttributes.addEventListener('change', Event => {
                    for (let j = 0; j < selectProductAttributes.length; j++) {
                        if (selectProductAttributes[j].value === Event.currentTarget.value) {
                            quantityInStock.innerHTML = selectProductAttributes[j].dataset.instock;
                            break;
                        }
                    }
                });

                import('./templates_module').then(mod => {

                    let urlProductToCart = document.querySelector('[data-customercart]').dataset.customercart;
                    let newUrlProductToCart;

                    document.getElementById('add-product-to-cart').addEventListener('submit', Event => {
                        Event.preventDefault();

                        /*
                         * Insert product to cart on bdd
                         */
                        let id_product_without_attribute = formAddProductToCart.dataset.idproductattribute;
                        let id_prod_attr = document.getElementById('js-output-attributes-products').value;
                        let argsURL = '';

                        // S'il y a des éléments option dans le select alors les paramètres sont affectés par ces valeurs
                        if (selectProductAttributes.length > 0) {
                            argsURL = '/' +
                                formAddProductToCart.dataset.idproduct + '/' + // Get id_product
                                id_prod_attr + '/' + // Get id_product_attribute
                                document.getElementById('product-quantity').value + '/' + // Get quantity
                                formAddProductToCart.dataset.idcustomer + '/' + // Get id_customer
                                formAddProductToCart.dataset.idcart; // Get id_cart
                        } else if (formAddProductToCart.dataset.idcart === 'undefined') {
                            argsURL = '/' +
                                formAddProductToCart.dataset.idproduct + '/' + // Get id_product
                                id_product_without_attribute + '/' + // Get id_product_attribute
                                document.getElementById('product-quantity').value + '/' + // Get quantity
                                formAddProductToCart.dataset.idcustomer + '/' + // Get id_customer
                                document.querySelector('a.customer-cart-to-use').dataset.idnewcart; // Get id_cart
                        } else {
                            argsURL = '/' +
                                formAddProductToCart.dataset.idproduct + '/' + // Get id_product
                                id_product_without_attribute + '/' + // Get id_product_attribute
                                document.getElementById('product-quantity').value + '/' + // Get quantity
                                formAddProductToCart.dataset.idcustomer + '/' + // Get id_customer
                                formAddProductToCart.dataset.idcart; // Get id_cart
                        }

                        let urlPost = Event.currentTarget.dataset.urlpost;
                        const getCustomerLastCart = (cart) => document.getElementById('add-product-to-cart').dataset.idcart = cart.id_cart;

                        QuotationModule.getData(
                            urlPost.replace(/(\/\d+){5}(?=\?_token)/, argsURL),
                            getCustomerLastCart,
                            null,
                            'POST',
                            true,
                            []
                        );

                        /*
                         * show product on cart
                         */
                        let paramsShowCart = formAddProductToCart.dataset.idcart;
                        newUrlProductToCart = window.location.origin + urlProductToCart.replace(/\d+(?=\?_token)/, paramsShowCart);

                        const showProductsOnCart = (cart) => {
                            let picture = window.location.origin + '/img/p/';
                            let outputCartTotal = '';
                            let outputProductOnCart = '';

                            for (let product of cart['products']) {
                                outputProductOnCart += mod.TemplateModule.quotationCartProducts
                                    .replace(/---picture---/, picture + product.path.join('/') + '/' + product.id_image + '-cart_default.jpg')
                                    .replace(/---idProduct---/, product.id_product)
                                    .replace(/---idProductAttribute---/, product.id_product_attribute)
                                    .replace(/---productName---/, product.product_name)
                                    .replace(/---idProdAttr---/, product.id_product_attribute)
                                    .replace(/---idProd---/, product.id_product)
                                    .replace(/---productAttribute---/, product.attributes)
                                    .replace(/---productPrice---/, product.product_price + ' €')
                                    .replace(/---productTaxe---/, product.tva_amount_product)
                                    .replace(/---productQuantity---/, product.product_quantity)
                                    .replace(/---totalProductTaxe---/, product.total_tva_amount_product)
                                    .replace(/---totalProduct---/, product.total_product + ' €')
                                    .replace(/---token---/, new URL(window.location.href).searchParams.get('_token'));
                            }


                            outputCartTotal += mod.TemplateModule.quotationCart
                                .replace(/---totalCartTaxes---/, cart['total_taxes'] + ' €')
                                .replace(/---totalCart---/, cart['total_cart'] + ' €');

                            document.getElementById('output-cart-products-to-use').innerHTML = outputProductOnCart;
                            document.getElementById('output-cart-products-to-use').setAttribute('data-idcart', cart.id_cart);
                            document.getElementById('output-cart-to-use').innerHTML = outputCartTotal;
                            // On ajoute l'attribut data-idcart à l'élément id output-discounts
                            document.getElementById('output-discounts').setAttribute('data-idcart', cart.id_cart);

                            /*
                             * Show cart_summary
                             */
                            let outputCartSummaryTotalProducts = '';
                            let outputCartSummaryTotalTaxes = '';
                            let outputCartSummaryTotalCartWithoutTaxes = '';
                            let outputCartSummaryTotalCartWithTaxes = '';

                            let cartSummaryTotalProducts = document.getElementById('cart_summary_total_products');
                            let cartSummaryTotalTaxes = document.getElementById('cart_summary_total_taxes');
                            let cartSummaryTotalWithoutTaxes = document.getElementById('cart_summary_total_without_taxes');
                            let cartSummaryTotalWithTaxes = document.getElementById('cart_summary_total_with_taxes');

                            outputCartSummaryTotalProducts = mod.TemplateModule.cartSummaryTotalProducts.replace(/---totalProducts---/,
                                document.getElementById('total_cart').textContent);
                            outputCartSummaryTotalTaxes = mod.TemplateModule.cartSummaryTotalTaxes.replace(/---totalTaxesCartSummary---/,
                                document.getElementById('total_cart_taxes').textContent);
                            outputCartSummaryTotalCartWithoutTaxes = mod.TemplateModule.cartSummaryTotalWithoutTaxes.replace(/---totalCartWithoutTaxes---/,
                                document.getElementById('total_cart').textContent);

                            cartSummaryTotalProducts.innerHTML = outputCartSummaryTotalProducts;
                            cartSummaryTotalTaxes.innerHTML = outputCartSummaryTotalTaxes;
                            cartSummaryTotalWithoutTaxes.innerHTML = outputCartSummaryTotalCartWithoutTaxes;

                            let cartSummaryTotalTaxesValue = parseFloat(cartSummaryTotalTaxes.textContent.split(' ')[0]);
                            let cartSummaryTotalWithoutTaxesValue = parseFloat(cartSummaryTotalWithoutTaxes.textContent.split(' ')[0]);
                            let cartSummaryTotalWithTaxesValue = parseFloat(cartSummaryTotalTaxesValue + cartSummaryTotalWithoutTaxesValue).toFixed(2);

                            outputCartSummaryTotalCartWithTaxes = mod.TemplateModule.cartSummaryTotalWithTaxes.replace(/---totalCartWithTaxes---/, cartSummaryTotalWithTaxesValue + ' €');
                            cartSummaryTotalWithTaxes.innerHTML = outputCartSummaryTotalCartWithTaxes;

                            /*
                             * Update product quantity on cart
                             */
                            let paramsUrlProductQuantity = '';

                            if (document.querySelectorAll('input.cart_quantity') !== null) {
                                // On boucle sur chaque élément input auquel on attache l'évènement change
                                document.querySelectorAll('input.cart_quantity').forEach(function (input) {
                                    input.addEventListener('change', function (Event) {

                                        Event.preventDefault();
                                        // On va récupérer l'élément parent et ses enfants
                                        let children = Event.currentTarget.closest('tr').children;
                                        let idProduct, idProductAttribute;

                                        // On récupère l'id_product et l'id_product_attribute
                                        for (let i = 0; i < children.length; i++) {
                                            let regexp = new RegExp('^(product_name_)');
                                            if (children[i].id.match(regexp) !== null) {
                                                idProduct = children[i].id.split('_')[2];
                                                idProductAttribute = children[i].id.split('_')[3];
                                            }
                                        }

                                        // On récupère l'élément input et sa valeur
                                        let inputQty = Event.currentTarget.closest('tr').querySelector('.cart_quantity');
                                        // On récupère le prix unitaire
                                        let priceElement = Event.currentTarget.closest('tr').querySelector('.product_price_cart');
                                        // On récupère le total des produit
                                        let totalPriceElement = Event.currentTarget.closest('tr').querySelector('.total_product_price_on_cart');
                                        inputQty.value = Event.currentTarget.value;
                                        let currentPrice = priceElement.textContent.split(' ')[0];
                                        let euroSymbol = priceElement.textContent.split(' ')[1];
                                        totalPriceElement.textContent = Math.round(parseFloat(currentPrice) * parseFloat(Event.currentTarget.value) * 100) / 100 + ' ' + euroSymbol;

                                        // On récupère la tva du produit
                                        let priceTaxe = Event.currentTarget.closest('tr').querySelector('.product_taxe').textContent;
                                        // On récupère le total de la tva du produit
                                        let totalPriceTaxe = Event.currentTarget.closest('tr').querySelector('.total_product_taxe');
                                        totalPriceTaxe.textContent = Math.round(parseFloat(priceTaxe) * parseFloat(Event.currentTarget.value) * 100) / 100 + ' €';

                                        paramsUrlProductQuantity = '/' +
                                            document.getElementById('output-cart-products-to-use').dataset.idcart + '/' + // Get id_cart
                                            idProduct + '/' + // Get id_product
                                            idProductAttribute + '/' + // Get id_product_attribute
                                            Event.currentTarget.value + '?' +  // Get quantity
                                            "_token=" + document.getElementById('token').value; // Get token

                                        let urlProductQtyPost = window.location.origin + '/' + adminFolderName + '/index.php/modules/quotation/admin/update/quantity/product/cart' + paramsUrlProductQuantity;

                                        const getCart = (cart) => document.getElementById('add-product-to-cart').dataset.idcart = cart.id_cart;

                                        QuotationModule.getData(
                                            urlProductQtyPost,
                                            getCart,
                                            null,
                                            'POST',
                                            true,
                                            []
                                        );

                                        /*
                                         * Update total product price and total cart when product quantity change
                                         */
                                        const showProductsTotalPriceUpdateOnCart = (cart) => {
                                            document.getElementById('total_cart_taxes').innerHTML = cart['total_taxes'] + ' €';
                                            document.getElementById('total_cart').innerHTML = cart['total_cart'] + ' €';
                                            // On récupère le total cart à jour sur la section cart_summary
                                            cartSummaryTotalProducts.innerHTML = cart['total_cart'] + ' €';
                                            cartSummaryTotalWithoutTaxes.innerHTML = cart['total_cart'] + ' €';
                                            // On récupère le total tva à jour sur la section cart_summary
                                            cartSummaryTotalTaxes.innerHTML = cart['total_taxes'] + ' €';
                                            // On récupère le total ttc à jour sur la section cart_summary
                                            cartSummaryTotalTaxesValue = parseFloat(cartSummaryTotalTaxes.textContent.split(' ')[0]);
                                            cartSummaryTotalWithoutTaxesValue = parseFloat(cartSummaryTotalWithoutTaxes.textContent.split(' ')[0]);
                                            cartSummaryTotalWithTaxesValue = parseFloat(cartSummaryTotalTaxesValue + cartSummaryTotalWithoutTaxesValue).toFixed(2);

                                            outputCartSummaryTotalCartWithTaxes = mod.TemplateModule.cartSummaryTotalWithTaxes.replace(/---totalCartWithTaxes---/, cartSummaryTotalWithTaxesValue + ' €');
                                            cartSummaryTotalWithTaxes.innerHTML = outputCartSummaryTotalCartWithTaxes;
                                        };

                                        QuotationModule.getData(
                                            urlProductQtyPost,
                                            showProductsTotalPriceUpdateOnCart,
                                            null,
                                            null,
                                            true,
                                            []
                                        );
                                    });
                                });
                            }
                            ;

                            /*
                             * Delete product on cart
                             */
                            let urlProductToDelete;
                            let paramsUrlProductToDelete = '';

                            if (document.querySelectorAll('button.delete_product') !== null) {
                                document.querySelectorAll('button.delete_product').forEach(function (link) {
                                    link.addEventListener('click', function (Event) {
                                        Event.preventDefault();

                                        let children = Event.currentTarget.closest('tr').children;
                                        let idProductToDelete, idProductAttributeToDelete;

                                        for (let i = 0; i < children.length; i++) {
                                            let regexp = new RegExp('^(product_name_)');
                                            if (children[i].id.match(regexp) !== null) {
                                                idProductToDelete = children[i].id.split('_')[2];
                                                idProductAttributeToDelete = children[i].id.split('_')[3];
                                            }
                                        }

                                        paramsUrlProductToDelete = '/' +
                                            document.getElementById('output-cart-products-to-use').dataset.idcart + '/' + // Get id_cart
                                            idProductToDelete + '/' + // Get id_product
                                            idProductAttributeToDelete + '?' + // Get id_product_attribute
                                            "_token=" + document.getElementById('token').value; // Get token

                                        urlProductToDelete = window.location.origin + '/' + adminFolderName + '/index.php/modules/quotation/admin/delete/product/cart' + paramsUrlProductToDelete;

                                        // On ajoute à l'élément tr le plus proche la class='d-none'
                                        Event.currentTarget.closest('tr').classList.add('d-none');

                                        // On récupère le total_cart à jour
                                        const getUpdateCart = (cart) => {
                                            document.getElementById('total_cart_taxes').innerHTML = cart['total_taxes'] + ' €';
                                            document.getElementById('total_cart').innerHTML = cart['total_cart'] + ' €';
                                            // On récupère le total cart à jour sur la section cart_summary
                                            cartSummaryTotalProducts.innerHTML = cart['total_cart'] + ' €';
                                            cartSummaryTotalWithoutTaxes.innerHTML = cart['total_cart'] + ' €';
                                            // On récupère le total tva à jour sur la section cart_summary
                                            cartSummaryTotalTaxes.innerHTML = cart['total_taxes'] + ' €';
                                            // On récupère le total ttc à jour sur la section cart_summary
                                            cartSummaryTotalTaxesValue = parseFloat(cartSummaryTotalTaxes.textContent.split(' ')[0]);
                                            cartSummaryTotalWithoutTaxesValue = parseFloat(cartSummaryTotalWithoutTaxes.textContent.split(' ')[0]);
                                            cartSummaryTotalWithTaxesValue = parseFloat(cartSummaryTotalTaxesValue + cartSummaryTotalWithoutTaxesValue).toFixed(2);

                                            outputCartSummaryTotalCartWithTaxes = mod.TemplateModule.cartSummaryTotalWithTaxes.replace(/---totalCartWithTaxes---/, cartSummaryTotalWithTaxesValue + ' €');
                                            cartSummaryTotalWithTaxes.innerHTML = outputCartSummaryTotalCartWithTaxes;
                                        };

                                        QuotationModule.getData(
                                            urlProductToDelete,
                                            getUpdateCart,
                                            null,
                                            'POST',
                                            true,
                                            []
                                        );

                                    })
                                });
                            }
                            ;
                        };

                        QuotationModule.getData(
                            newUrlProductToCart,
                            showProductsOnCart,
                            null,
                            null,
                            true,
                            []
                        );

                        // On affiche le récapitulatif du panier
                        document.getElementById('js-output-cart-summary').classList.replace('d-none', 'd-block');
                        // On récupère le style du form-control
                        document.getElementById('quotation_status_status').classList.replace('custom-select', 'form-control');
                    });
                });
            };

            QuotationModule.getData(
                urlSearchAttributesProduct,
                getAttributesProduct,
                null,
                null,
                true,
                []
            );

            document.getElementById('js-output-product-to-cart').classList.replace('d-none', 'd-block');
        }
    };

    const inputSearchProducts = document.getElementById('quotation_product_cartId');
    ['keyup', 'click'].forEach(event => {
        inputSearchProducts.addEventListener(event, getQueryProduct, false);
    });

    /*
    *Search discounts section
    */
    let urlDiscount = document.getElementById('js-data-discount').dataset.source;

    QuotationModule.getData(
        urlDiscount,
        QuotationModule.getData,
        QuotationModule.getDiscountsURL(),
        null,
        true,
        []
    );

    QuotationModule.getData(
        QuotationModule.getDiscountsURL(),
        QuotationModule.autocomplete,
        null,
        null,
        true,
        ['#quotation_discount_cartId', 'discounts', 2]
    );

    const getQueryDiscount = (Event) => {

        let urlSearchDiscount = document.getElementById('js-data-discount').dataset.discount;
        let urlShowCartDiscounts = document.getElementById('js-data-discount').dataset.cart;

        let idCartRule = parseInt(Event.currentTarget.value.replace(/[^(\d)+(\s){1}]/, '').trim());
        urlSearchDiscount = window.location.origin + urlSearchDiscount.replace(/\d+(?=\?_token)/, idCartRule);
        urlShowCartDiscounts = window.location.origin + urlShowCartDiscounts.replace(/\d+(?=\?_token)/, document.getElementById('output-discounts').dataset.idcart);

        let urlAssignCartRuleToCart;
        let cartRuleParamsUrl = '';

        const showDiscountToUse = (discount) => {

            document.getElementById('output-discounts').setAttribute('data-idcartrule', discount.id_cart_rule);
            document.getElementById('output-discounts').setAttribute('data-token', new URL(window.location.href).searchParams.get('_token'));

            import('./templates_module').then(mod => {

                let id_cart = document.getElementById('output-discounts').dataset.idcart;
                let token = document.getElementById('output-discounts').dataset.token;

                document.getElementById('submitCartRuleToUse').addEventListener('click', Event => {
                    Event.preventDefault();

                    let id_cart_rule = document.getElementById('output-discounts').dataset.idcartrule;
                    let date = new Date();
                    let dateToday = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toISOString().substr(0, 19).replace('T', ' ');
                    let discountDateEnd = discount.date_to;
                    let total_cart = parseFloat(document.getElementById('total_cart').textContent.split(' ')[0]);
                    let cartRuleId = discount.id_cart_rule;
                    let cartRuleMinimumAmount = parseFloat(discount.minimum_amount);
                    let reductionProduct = discount.reduction_product;
                    let idProduct;
                    let cartProducts = [];
                    let regexProduct = new RegExp('^(product_name_)');
                    let firstChildren = document.getElementById('output-cart-products-to-use').children;

                    // On récupère l'id_product dans le tbody 'output-cart-products-to-use'
                    for (let i = 0; i < firstChildren.length; i++) {
                        let secondChildren = firstChildren[i].children;
                        for (let j = 0; j < secondChildren.length; j++) {
                            if (secondChildren[j].id.match(regexProduct) !== null) {
                                idProduct = secondChildren[j].id.split('_')[2];
                            }
                            cartProducts.push(idProduct);
                        }
                    }

                    if (total_cart > cartRuleMinimumAmount) {
                        if (dateToday < discountDateEnd) {
                            for (let k = 0; k < cartProducts.length; k++) {
                                if (reductionProduct === cartProducts[k] || reductionProduct === null) {
                                    if (id_cart_rule === cartRuleId) {

                                        /*
                                         * Assign cart_rule to cart on bdd
                                         */
                                        cartRuleParamsUrl = '/' + id_cart + '/' + id_cart_rule + '?' + "_token=" + token;
                                        urlAssignCartRuleToCart = window.location.origin + '/' + adminFolderName + '/index.php/modules/quotation/admin/assign/discount/cart' + cartRuleParamsUrl;

                                        const getCartRuleToCart = (discount) => {
                                        };

                                        QuotationModule.getData(
                                            urlAssignCartRuleToCart,
                                            getCartRuleToCart,
                                            null,
                                            'POST',
                                            true,
                                            []
                                        );

                                        document.getElementById('discount_table').classList.remove('d-none');
                                        document.getElementById('discount_cart_err').classList.add('d-none');
                                        document.getElementById('discount_date_err').classList.add('d-none');

                                        /*
                                         * Show cart_rule assign to cart
                                         */
                                        const showCartDiscounts = (cart) => {
                                            let outputDiscount = '';

                                            for (let discount of cart['discounts']) {
                                                outputDiscount += mod.TemplateModule.discountSelected
                                                    .replace(/---idCartRule---/, discount.id_cart_rule)
                                                    .replace(/---discountName---/, discount.name)
                                                    .replace(/---discountDescription---/, discount.description)
                                                    .replace(/---discountValue---/, discount.reduction_amount + ' €');
                                            }
                                            document.getElementById('output-discounts').innerHTML = outputDiscount;

                                            /*
                                             * Show cart summary
                                             */
                                            let outputCartSummaryTotalDiscounts = '';
                                            let cartSummaryTotalProducts = document.getElementById('cart_summary_total_products');
                                            let cartSummaryTotalDiscounts = document.getElementById('cart_summary_total_discounts');
                                            let cartSummaryTotalTaxes = document.getElementById('cart_summary_total_taxes');
                                            let cartSummaryTotalWithoutTaxes = document.getElementById('cart_summary_total_without_taxes');
                                            let cartSummaryTotalWithTaxesAndDiscounts = document.getElementById('cart_summary_total_with_taxes');

                                            outputCartSummaryTotalDiscounts = mod.TemplateModule.cartSummaryTotalDiscounts.replace(/---totalDiscounts---/,
                                                cart['total_discounts'] + ' €');

                                            cartSummaryTotalDiscounts.innerHTML = outputCartSummaryTotalDiscounts;
                                            cartSummaryTotalWithoutTaxes.innerHTML = (parseFloat(cartSummaryTotalProducts.textContent.split(' ')[0])
                                                - parseFloat(cartSummaryTotalDiscounts.textContent.split(' ')[0])).toFixed(2) + ' €';
                                            cartSummaryTotalTaxes.innerHTML = cart['total_taxes'] + ' €';
                                            // On récupère le total ttc à jour après les réductions
                                            cartSummaryTotalWithTaxesAndDiscounts.innerHTML = (parseFloat(cartSummaryTotalWithoutTaxes.textContent.split(' ')[0])
                                                + parseFloat(cartSummaryTotalTaxes.textContent.split(' ')[0])).toFixed(2) + ' €';


                                            /*
                                             * Delete discount assign to cart
                                             */
                                            let urlDiscountToDelete;
                                            let paramsUrlDiscountToDelete = '';

                                            if (document.querySelectorAll('button.delete_discount') !== null) {
                                                document.querySelectorAll('button.delete_discount').forEach(function (link) {
                                                    link.addEventListener('click', function (Event) {
                                                        Event.preventDefault();

                                                        let children = Event.currentTarget.closest('tr').children;
                                                        let idDiscount;

                                                        for (let i = 0; i < children.length; i++) {
                                                            let regexp = new RegExp('^(discount-name_)');
                                                            if (children[i].id.match(regexp) !== null) {
                                                                idDiscount = children[i].id.split('_')[1];
                                                            }
                                                        }

                                                        paramsUrlDiscountToDelete = '/' + id_cart + '/' + idDiscount + '?' + "_token=" + token;
                                                        urlDiscountToDelete = window.location.origin + '/' + adminFolderName + '/index.php/modules/quotation/admin/delete/discount/cart' + paramsUrlDiscountToDelete;

                                                        Event.currentTarget.closest('tr').classList.add('d-none');

                                                        const getUpdateDiscountOnCart = (cart) => {
                                                            cartSummaryTotalDiscounts.innerHTML = cart['total_discounts'] + ' €';
                                                            cartSummaryTotalWithoutTaxes.innerHTML = (parseFloat(cartSummaryTotalProducts.textContent.split(' ')[0])
                                                                - parseFloat(cartSummaryTotalDiscounts.textContent.split(' ')[0])).toFixed(2) + ' €';
                                                            cartSummaryTotalTaxes.innerHTML = cart['total_taxes'] + ' €';
                                                            // On récupère le total ttc à jour après les réductions
                                                            cartSummaryTotalWithTaxesAndDiscounts.innerHTML = (parseFloat(cartSummaryTotalWithoutTaxes.textContent.split(' ')[0])
                                                                // - parseFloat(cartSummaryTotalDiscounts.textContent.split(' ')[0])
                                                                + parseFloat(cartSummaryTotalTaxes.textContent.split(' ')[0])).toFixed(2) + ' €';
                                                        };

                                                        QuotationModule.getData(
                                                            urlDiscountToDelete,
                                                            getUpdateDiscountOnCart,
                                                            null,
                                                            'POST',
                                                            true,
                                                            []
                                                        );
                                                    });
                                                });
                                            }
                                            ;
                                        };

                                        QuotationModule.getData(
                                            urlShowCartDiscounts,
                                            showCartDiscounts,
                                            null,
                                            null,
                                            true,
                                            []
                                        );

                                    }
                                    document.getElementById('discount_date_err').classList.add('d-none');
                                    document.getElementById('discount_product_err').classList.add('d-none');
                                } else {
                                    document.getElementById('discount_product_err').classList.remove('d-none');
                                }
                                document.getElementById('discount_date_err').classList.add('d-none');
                            }
                        } else {
                            document.getElementById('discount_date_err').classList.remove('d-none');
                            document.getElementById('discount_product_err').classList.add('d-none');
                        }
                        document.getElementById('discount_cart_err').classList.add('d-none');
                    } else {
                        document.getElementById('discount_cart_err').classList.remove('d-none');
                        document.getElementById('discount_date_err').classList.add('d-none');
                        document.getElementById('discount_product_err').classList.add('d-none');
                    }

                });
            });
        };

        QuotationModule.getData(
            urlSearchDiscount,
            showDiscountToUse,
            null,
            null,
            true,
            []
        );
    };

    const inputSearchDiscounts = document.getElementById('quotation_discount_cartId').addEventListener('blur', getQueryDiscount, false);

    /*
     * Create new quotation
     */
    let urlCreateNewQuotation = document.getElementById('create-new-quotation').dataset.urlquotationpost;

    let paramsUrlCreateNewQuotation = '';

    document.getElementById('submitCreateNewQuotation').addEventListener('click', Event => {

        let idQuotation = document.getElementById('add-product-to-cart').dataset.idquotation;
        let newQuotationToken = new URL(window.location.href).searchParams.get('_token');
        let newQuotationCartId = document.getElementById('add-product-to-cart').dataset.idcart;
        let newQuotationCustomerId = document.getElementById('add-product-to-cart').dataset.idcustomer;
        let newQuotationCustomerName = document.getElementById('add-product-to-cart').dataset.customername.substr(0, 3);
        let randomNumbReference = Math.floor(Math.random() * 1000000);
        let newQuotationReference = newQuotationCustomerId + newQuotationCustomerName + randomNumbReference;
        let newQuotationMessage = document.getElementById('quotation_message').value;
        let newQuotationDate = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toISOString().substr(0, 19).replace('T', ' ');
        let newQuotationStatus = document.getElementById('quotation_status_status').value;
        let verifStatus = /\w+/;

        // On vérifie si le statut est valide
        if(verifStatus.exec(newQuotationStatus) == null) {
            document.getElementById('quotation_status_error').classList.remove('d-none');
            Event.preventDefault();
            return false;
        } else {
            paramsUrlCreateNewQuotation = '/' + newQuotationCartId + '/' + newQuotationCustomerId + '/' + newQuotationReference + '/' + newQuotationMessage + ' ' + '/' + newQuotationDate
                + '/' + newQuotationStatus + '?' + "_token=" + newQuotationToken;
            urlCreateNewQuotation = urlCreateNewQuotation.replace(/\/0(.*)$/g, paramsUrlCreateNewQuotation);
        }

        const getQuotation = (quotation) => {
            console.log('it works');
        };

        QuotationModule.getData(
            urlCreateNewQuotation,
            getQuotation,
            null,
            'POST',
            true,
            []
        );

        // On fait une redirection vers la page show_quotation.html.twig
        location.href = window.location.origin + '/' + adminFolderName + '/index.php/modules/quotation/admin/show/quotation/' + idQuotation + '?' + "_token=" + newQuotationToken;
    });
}

/*
 * Code on show quotation page
 */
if (QuotationModule.getParamFromURL('show/quotation/' + '\\d+') !== null && QuotationModule.getParamFromURL('show/quotation/' + '\\d+').length === 1) {

    // On récupère le nom du dossier admin
    let adminFolderNameShowPage = window.location.pathname;
    adminFolderNameShowPage = adminFolderNameShowPage.split("/");
    adminFolderNameShowPage = adminFolderNameShowPage[adminFolderNameShowPage.length - 8];

    // On récupère le style du form-control et non celui du csutom-select pour l'attribut html select
    document.getElementById('quotation_show_status_status').classList.replace('custom-select', 'form-control');

    let quotationToken = new URL(window.location.href).searchParams.get('_token');
    let quotationId = document.getElementById('quotation_number').dataset.idquotation;
    /*
     * Update quotation status
     */
    let urlUpdateStatusQuotation;
    let paramsUrlUpdateStatusQuotation = '';

    document.getElementById('quotation_show_status_status').addEventListener('change', Event => {
        Event.preventDefault();

        let quotationStatus = document.getElementById('quotation_show_status_status').value;

        paramsUrlUpdateStatusQuotation = '/' + quotationId + '/' + quotationStatus + '?' + "_token=" + quotationToken;

        urlUpdateStatusQuotation = window.location.origin + '/' + adminFolderNameShowPage + '/index.php/modules/quotation/admin/update/status/quotation' + paramsUrlUpdateStatusQuotation;

        document.getElementById('quotation_status_success').classList.remove('d-none');

        const getStatusQuotation = (quotation) => {
        };

        QuotationModule.getData(
            urlUpdateStatusQuotation,
            getStatusQuotation,
            null,
            'POST',
            true,
            []
        );
    });

    /*
    * Update quotation message
    */
    let urlUpdateMessageQuotation;
    let paramsUrlUpdateMessageQuotation = '';

    document.getElementById('submitNewMessage').addEventListener('click', Event => {
        Event.preventDefault();

        let quotationMessage = document.getElementById('show_message').value;

        paramsUrlUpdateMessageQuotation = '/' + quotationId + '/' + quotationMessage + '?' + "_token=" + quotationToken;

        urlUpdateMessageQuotation = window.location.origin + '/' + adminFolderNameShowPage + '/index.php/modules/quotation/admin/update/message/quotation' + paramsUrlUpdateMessageQuotation;

        document.getElementById('quotation_message_success').classList.remove('d-none');

        const getMessageQuotation = (quotation) => {
        };

        QuotationModule.getData(
            urlUpdateMessageQuotation,
            getMessageQuotation,
            null,
            'POST',
            true,
            []
        );
    });
}

/*
 * Code on Index page
 */
if (QuotationModule.getParamFromURL('research') !== null && QuotationModule.getParamFromURL('research').length === 1 ||
    QuotationModule.getParamFromURL('research/' + '\\d+') !== null && QuotationModule.getParamFromURL('research/' + '\\d+').length === 1) {

    // On récupère le nom du dossier admin
    let adminFolderNameIndexPage = window.location.pathname;
    if (QuotationModule.getParamFromURL('research') !== null && QuotationModule.getParamFromURL('research').length === 1) {
        adminFolderNameIndexPage = adminFolderNameIndexPage.split("/");
        adminFolderNameIndexPage = adminFolderNameIndexPage[adminFolderNameIndexPage.length - 6];
    } else {
        adminFolderNameIndexPage = adminFolderNameIndexPage.split("/");
        adminFolderNameIndexPage = adminFolderNameIndexPage[adminFolderNameIndexPage.length - 7];
    }

    var current_page = document.getElementById("index_page").dataset.page;
    let indexToken = document.getElementById('quotation-head').dataset.indextoken;

    if (window.location.pathname.replace(/.*(?=\/quotation\/admin\/research)/ || /.*(?=\/quotation\/admin\/research\/)/, '') === '/quotation/admin/research' || '/quotation/admin/research/' + current_page) {
        document.getElementById('filter_page').addEventListener('click', Event => {
            // Event.preventDefault();

            let form = Event.currentTarget.closest('thead').querySelector('form'); // Get form
            const _url = window.location.origin + '/' + adminFolderNameIndexPage + '/index.php/modules/quotation/admin/research?';
            const params = {
                tokenSearch: 'quotation_search[_token]=' + document.getElementById('quotation_search__token').value,
                end: 'quotation_search[end]=' + document.getElementById('quotation_search_end').value,
                name: 'quotation_search[name]=' + document.getElementById('quotation_search_name').value,
                reference: 'quotation_search[reference]=' + document.getElementById('quotation_search_reference').value,
                start: 'quotation_search[start]=' + document.getElementById('quotation_search_start').value,
                status: 'quotation_search[status]=' + document.getElementById('quotation_search_status').value,
            };
            const url = Object.values(params).join('&');
            form.method = 'GET';
            form.action = _url + url;
            form.submit();

            location.href = _url + url + '&' + indexToken;
        });
    }

    /*
     * Update quotation status on index page
     */
    if (document.querySelectorAll('select.index_quotation_status') !== null) {
        document.querySelectorAll('select.index_quotation_status').forEach(function (link) {
            link.addEventListener('change', function (Event) {
                Event.preventDefault();

                let indexQuotationToken = new URL(window.location.href).searchParams.get('_token');
                let children = Event.currentTarget.closest('tr').children;
                let indexQuotationId;
                let urlUpdateIndexQuotationStatus;
                let paramsUrlUpdateIndexQuotationStatus = '';

                // On récupère l'id_quotation
                for (let i = 0; i < children.length; i++) {
                    let regexp = new RegExp('^(index-quotation-id_)');
                    if (children[i].id.match(regexp) !== null) {
                        indexQuotationId = children[i].id.split('_')[1];
                    }
                }

                // On récupère la valeur de l'option du select
                let indexQuotationStatus = document.getElementById('output_quotation_status_' + indexQuotationId).value;
                paramsUrlUpdateIndexQuotationStatus = '/' + indexQuotationId + '/' + indexQuotationStatus + '?' + "_token=" + indexQuotationToken;

                urlUpdateIndexQuotationStatus = window.location.origin + '/' + adminFolderNameIndexPage + '/index.php/modules/quotation/admin/update/status/quotation' + paramsUrlUpdateIndexQuotationStatus;

                let linkToOrder = document.getElementById('link_to_order_' + indexQuotationId);

                if(indexQuotationStatus === 'validated') {
                    linkToOrder.classList.replace('d-none', 'd-flex')
                } else {
                    linkToOrder.classList.replace('d-flex', 'd-none')
                }

                let linkToShowOrder = document.getElementById('link_to_show_order_' + indexQuotationId);

                if(indexQuotationStatus === 'ordered') {
                    linkToShowOrder.classList.replace('d-none', 'd-flex')
                } else {
                    linkToShowOrder.classList.replace('d-flex', 'd-none')
                }

                document.getElementById('index_quotation_status_success').classList.remove('d-none');

                const getUpdateQuotationStatus = (quotation) => {
                };

                QuotationModule.getData(
                    urlUpdateIndexQuotationStatus,
                    getUpdateQuotationStatus,
                    null,
                    'POST',
                    true,
                    []
                );
            });
        });
    };
}

// any SCSS you require will output into a single scss file (app.scss in this case)

// or you can include specific pieces
// require('bootstrap/js/dist/tooltip');
// require('bootstrap/js/dist/popover');

$(document).ready(function () {
    $('[data-toggle="popover"]').popover();
});
