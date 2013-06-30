angular.module('cloudstack').factory("Dictionary", function(){
    var dictionary = {
        labels: {
            id : 'ID',
            username : 'Username',
            account : 'Account',
            domain : 'Domain',
            state : 'State',
            displayname : 'Display Name',
            instancename : 'Instance Name',
            zonename : 'Zone Name',
            type : 'Type',
            description : 'Description',
            created : 'Created',
            name : 'Name',
            value : 'Value',
            displaytext : 'Description',
            networktype : 'Network Type',
            allocationstate : 'Allocation State',
            vmdisplayname: 'VM display name',
            hypervisor : 'Hypervisor',
        }
    };
    return dictionary;
});
