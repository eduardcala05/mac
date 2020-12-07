<template>
    <span
    class="text-danger f-10 tres-puntos d-block"
    >
        {{texto}}
    </span>
</template>

<script>
export default {
    name: 'VeeError',
    props: {
        texto: {
            type: String,
            default: ''
        }
    }
}
</script>
