import collections
import csv
from driver_identifier.drivers_identifier_cls import DriversIdentifier
import json

def print_driver_categories(categorized_drivers, uncategorized_drivers):
    if len(categorized_drivers) > 0:
        print('Drivers with category:')
        for driver_class, sub_classes in categorized_drivers.items():
            print('Driver class : {}'.format(driver_class))
            for driver_sub_class, drivers in sub_classes.items():
                print('Driver sub class: {}'.format(driver_sub_class))
                for driver in drivers:
                    print(driver)
    if len(uncategorized_drivers) > 0:
        print('Drivers without category:')
        for driver in uncategorized_drivers:
            print(driver)

# def identify_print(root_path):
#     identifier = DriversIdentifier()
#     #drivers = identifier.identify_drivers('/home/digitaltwins/drivers_test')
#     #drivers = identifier.identify_drivers('/lib/modules')
#     drivers = identifier.identify_drivers('/home/digitaltwins/Drivers/BMW')
#     for driver_group in drivers:
#         print('Drivers group root: {}'.format(driver_group.root_path))
#         if len(driver_group.built_in_drivers) > 0:
#             categorized_drivers = collections.defaultdict(dict)
#             uncategorized_drivers = []
#             print('Builtin drivers:')
#             for driver in driver_group.built_in_drivers:
#                 if driver.driver_class is not None:
#                     categorized_drivers.setdefault(driver.driver_class.driver_class, collections.defaultdict(list))[driver.driver_class.driver_sub_class].append(driver)
#                 else:
#                     uncategorized_drivers.append(driver)
#             print_driver_categories(categorized_drivers, uncategorized_drivers)
#         if len(driver_group.loadable_drivers) > 0:
#             print('Loadable drivers:')
#             categorized_drivers = collections.defaultdict(dict)
#             uncategorized_drivers = []
#             for driver in driver_group.loadable_drivers:
#                 if driver.driver_class is not None:
#                     categorized_drivers.setdefault(driver.driver_class.driver_class, collections.defaultdict(list))[driver.driver_class.driver_sub_class].append(driver)
#                 else:
#                     uncategorized_drivers.append(driver)
#             print_driver_categories(categorized_drivers, uncategorized_drivers)


def loadable_driver_csv_row_update(driver, driver_csv_row):
    driver_csv_row.update({'driver_name': driver.driver_name})
    if driver.description is not None:
        driver_csv_row.update({'description': driver.description})
    if driver.author is not None:
        driver_csv_row.update({'author': driver.author})
    if driver.license is not None:
        driver_csv_row.update({'license': driver.license})
    if driver.version is not None:
        driver_csv_row.update({'version': driver.version})
    if driver.relative_path is not None:
        driver_csv_row.update({'rel_path': driver.relative_path})
    if driver.aliases is not None and len(driver.aliases) > 0:
        aliases_str = ''
        supported_vendors = set()
        supported_types = set()
        for alias in driver.aliases:
            if alias.human_info is not None:
                vendor_name = alias.human_info.get('vendor',{}).get('name')
                if vendor_name is not None:
                    supported_vendors.add(vendor_name)
                if alias.alias_device_type is not None:
                    supported_types.add(alias.alias_device_type)

        aliases_dict = {}
        if len(supported_vendors)>0:
            aliases_dict.update({'supported_vendors':', '.join(supported_vendors)})
        if len(supported_types)>0:
            aliases_dict.update({'supported_types':', '.join(supported_types)})
        if len(aliases_dict) >0:
            driver_csv_row.update({'aliases': json.dumps(aliases_dict)})

def identify_to_csv(root_path, csv_out):
    with open(csv_out, 'w', newline='') as csvfile:
        fieldnames = ['root_group', 'driver_type', 'driver_class' ,'driver_sub_class','driver_name','description','author','license','version','aliases' ,'rel_path']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        identifier = DriversIdentifier()
        drivers = identifier.identify_drivers(root_path)
        for driver_group in drivers:
            print('Drivers group root: {}'.format(driver_group.root_path))
            if len(driver_group.built_in_drivers) > 0:
                categorized_drivers = collections.defaultdict(dict)
                uncategorized_drivers = []
                print('Builtin drivers:')
                for driver in driver_group.built_in_drivers:
                    if driver.driver_class is not None:
                        categorized_drivers.setdefault(driver.driver_class.driver_class, collections.defaultdict(list))[driver.driver_class.driver_sub_class].append(driver)
                    else:
                        uncategorized_drivers.append(driver)
                print_driver_categories(categorized_drivers, uncategorized_drivers)
                if len(categorized_drivers) > 0:
                    for driver_class, sub_classes in categorized_drivers.items():
                        for driver_sub_class, drivers in sub_classes.items():
                            for driver in drivers:
                                driver_csv_row = {'root_group': driver_group.root_path, 'driver_type': 'built-in', 'driver_class': driver_class, 'driver_sub_class': driver_sub_class, 'driver_name' : driver.driver_name, 'rel_path' : driver.kernel_path}
                                writer.writerow(driver_csv_row)
                if len(uncategorized_drivers) > 0:
                    for driver in uncategorized_drivers:
                        driver_csv_row = {'root_group': driver_group.root_path, 'driver_type': 'built-in', 'driver_name' : driver.driver_name, 'rel_path' : driver.kernel_path}
                        writer.writerow(driver_csv_row)

            if len(driver_group.loadable_drivers) > 0:
                print('Loadable drivers:')
                categorized_drivers = collections.defaultdict(dict)
                uncategorized_drivers = []
                for driver in driver_group.loadable_drivers:
                    if driver.driver_class is not None:
                        categorized_drivers.setdefault(driver.driver_class.driver_class, collections.defaultdict(list))[driver.driver_class.driver_sub_class].append(driver)
                    else:
                        uncategorized_drivers.append(driver)
                print_driver_categories(categorized_drivers, uncategorized_drivers)

                if len(categorized_drivers) > 0:
                    for driver_class, sub_classes in categorized_drivers.items():
                        for driver_sub_class, drivers in sub_classes.items():
                            for driver in drivers:
                                driver_csv_row = {'root_group': driver_group.root_path, 'driver_type': 'loadable', 'driver_class': driver_class, 'driver_sub_class': driver_sub_class}
                                loadable_driver_csv_row_update(driver, driver_csv_row)
                                writer.writerow(driver_csv_row)
                if len(uncategorized_drivers) > 0:
                    for driver in uncategorized_drivers:
                        driver_csv_row = {'root_group': driver_group.root_path, 'driver_type': 'loadable'}
                        loadable_driver_csv_row_update(driver, driver_csv_row)
                        writer.writerow(driver_csv_row)

def main():
    identify_to_csv('/home/digitaltwins/Drivers', '/home/digitaltwins/drivers_out.csv')

if __name__ == '__main__':
    main()