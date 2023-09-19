import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure-native";

// Create an Azure Resource Group
const resourceGroup = new azure.resources.ResourceGroup("myResourceGroup");

// Create a Virtual Network for the Hub
const vnet = new azure.network.VirtualNetwork("myVnet", {
    resourceGroupName: resourceGroup.name,
    addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
    },
});

// Create a subnet for the Hub
const hubSubnet = new azure.network.Subnet("hubSubnet", {
    resourceGroupName: resourceGroup.name,
    virtualNetworkName: vnet.name,
    addressPrefix: "10.0.0.0/24",
});

// Create the first VM in Spoke 1
const vm1 = new azure.compute.VirtualMachine("vm1", {
    resourceGroupName: resourceGroup.name,
    location: "East US", // Modify the location to your desired Azure region
    hardwareProfile: {
        vmSize: "Standard_DS2_v2",
    },
    osProfile: {
        computerName: "vm1",
        adminUsername: "adminuser",
        adminPassword: "Password12345!", // Replace with your own password
    },
    storageProfile: {
        imageReference: {
            publisher: "Canonical",
            offer: "UbuntuServer",
            sku: "18.04-LTS",
            version: "latest",
        },
        osDisk: {
            name: "osdisk",
            caching: "ReadWrite",
            createOption: "FromImage",
        },
    },
    networkProfile: {
        networkInterfaces: [
            {
                id: pulumi.interpolate`/subscriptions/${azure.config.subscriptionId}/resourceGroups/${resourceGroup.name}/providers/Microsoft.Network/networkInterfaces/vm1Nic`,
            },
        ],
    },
});

// Create the second VM in Spoke 2 (similar to VM1)
const vm2 = new azure.compute.VirtualMachine("vm2", {
    resourceGroupName: resourceGroup.name,
    location: "East US", // Modify the location to your desired Azure region
    hardwareProfile: {
        vmSize: "Standard_DS2_v2",
    },
    osProfile: {
        computerName: "vm2",
        adminUsername: "adminuser",
        adminPassword: "Password12345!", // Replace with your own password
    },
    storageProfile: {
        imageReference: {
            publisher: "Canonical",
            offer: "UbuntuServer",
            sku: "18.04-LTS",
            version: "latest",
        },
        osDisk: {
            name: "osdisk",
            caching: "ReadWrite",
            createOption: "FromImage",
        },
    },
    networkProfile: {
        networkInterfaces: [
            {
                id: pulumi.interpolate`/subscriptions/${azure.config.subscriptionId}/resourceGroups/${resourceGroup.name}/providers/Microsoft.Network/networkInterfaces/vm2Nic`,
            },
        ],
    },
});

