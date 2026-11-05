var PseudoKMEngine = (function() {

    function planReindex(kmknowledgebase) {
    }

    function refreshStatus(kmknowledgebase) {
    }

    function submitSearch(kmquery) {
    }

    function refreshIndexes() {
        return -1;
    }

    function drop(kmknowledgebase) {
    }

    function selectValidLibrary(fKmknowledgebase) {
        return fKmknowledgebase;
    }

    return {
        name: 'PSEUDO',
        planReindex: planReindex,
        refreshStatus: refreshStatus,
        submitSearch: submitSearch,
        refreshIndexes: refreshIndexes,
        selectValidLibrary: selectValidLibrary,
        drop: drop
    };
} ());


function require() {
    return PseudoKMEngine;
}