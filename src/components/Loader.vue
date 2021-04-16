<template>
    <div id="wrapper">
        <div id="loader">
            <img src="../assets/waav-logo-x256.svg" alt="logo">
        </div>
    </div>
</template>

<script>
export default {
    setup() {
        
    },
}
</script>

<style scoped>

@keyframes loadingAnimation {
    0% {
        transform: scaleX(-1);
    }
    50% {
        transform: rotate(180deg);
    }
    100% {
        transform: scaleX(1);
    }
}

#wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100vh;
    z-index: 10000;
}

#loader {
    display: flex;
    width: 14rem;
    height: 14rem;
    border-radius: 50%;
    background: #000;
    z-index: 10000;
}

#loader > * {
    animation: loadingAnimation 2s infinite alternate linear;
}

</style>