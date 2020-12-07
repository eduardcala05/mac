<template>
    <div class="row mx-0 shadow-sm ">
        <div class="col-12 shadow-sm py-3 px-0 d-flex justify-content-between">

            <div class="d-flex align-items-center ">
                <button
                type="button"
                class="btn btn-general btn-sm br-20 py-0 px-1 pr-3"
                @click="$router.back()"
                >
                    <i class="icon-left-circled f-20 mr-1" />
                    Atrás
                </button>
            </div>
            <div class="d-flex align-items-center ">
                <div class="px-2">
                    <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M10,17L6.5,13.5L7.91,12.08L10,14.17L15.18,9L16.59,10.41M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z" />
                    </svg>
                    <span class="ml-1">En línea </span>
                </div>
                <div class="px-2 align-items-center d-flex">
                    <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 12V13.5C21.21 13.5 23 15.29 23 17.5C23 18.32 22.75 19.08 22.33 19.71L21.24 18.62C21.41 18.28 21.5 17.9 21.5 17.5C21.5 16.12 20.38 15 19 15V16.5L16.75 14.25L16.72 14.22C16.78 14.17 16.85 14.13 19 12M19 23V21.5C16.79 21.5 15 19.71 15 17.5C15 16.68 15.25 15.92 15.67 15.29L16.76 16.38C16.59 16.72 16.5 17.1 16.5 17.5C16.5 18.88 17.62 20 19 20V18.5L21.25 20.75L21.28 20.78C21.22 20.83 21.15 20.87 19 23M13 17.5C13 13.91 15.91 11 19.5 11C20.78 11 21.97 11.38 23 12C22.13 10.9 20.84 10.14 19.35 10.03C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.03C2.34 8.36 0 10.9 0 14C0 17.31 2.69 20 6 20H13.5C13.18 19.23 13 18.39 13 17.5Z" />
                    </svg>
                    <span class="ml-1">Sincronizado </span>
                </div>
                <div class="px-2 align-items-center d-flex">
                    <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M7.73,10L15.73,18H6A4,4 0 0,1 2,14A4,4 0 0,1 6,10M3,5.27L5.75,8C2.56,8.15 0,10.77 0,14A6,6 0 0,0 6,20H17.73L19.73,22L21,20.73L4.27,4M19.35,10.03C18.67,6.59 15.64,4 12,4C10.5,4 9.15,4.43 8,5.17L9.45,6.63C10.21,6.23 11.08,6 12,6A5.5,5.5 0 0,1 17.5,11.5V12H19A3,3 0 0,1 22,15C22,16.13 21.36,17.11 20.44,17.62L21.89,19.07C23.16,18.16 24,16.68 24,15C24,12.36 21.95,10.22 19.35,10.03Z" />
                    </svg>
                    <span class="ml-1"> Fuera de línea </span>
                </div>
            </div>
        </div>
    </div>
</template>
