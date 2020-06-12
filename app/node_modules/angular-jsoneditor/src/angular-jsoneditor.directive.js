import Jsoneditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import 'jsoneditor/dist/img/jsoneditor-icons.svg';

export default () => {
    'ngInject';

    return {
        restrict: 'E',
        require: 'ngModel',
        scope: {'options': '='},
        link: ($scope, element, attrs, ngModel) => {
            let editor;
            const createEditor = (options) => {
                const settings = angular.extend({}, {}, options);
                settings.onChange = () => {
                    let isValid = false;
                    try {
                        ngModel.$setViewValue(editor.get());
                        isValid = true;
                    } catch (err) {
                        throw err;
                    } finally {
                        // Update field validation
                        ngModel.$setValidity('json', isValid);
                        ngModel.$setTouched();
                        $scope.$apply();
                        // If the user specified a onChange callback, trigger it
                        if (options.onChange && typeof options.onChange === 'function') {
                            options.onChange();
                        }
                    }
                };
                element.html('');
                return new Jsoneditor(element[0], settings);
            };

            editor = createEditor($scope.options);

            $scope.$watch('options', (newValue, oldValue) => {
                for (const k in newValue) {
                    if (newValue.hasOwnProperty(k)) {
                        const v = newValue[k];
                        if (newValue[k] !== oldValue[k]) {
                            if (k === 'mode') {
                                editor.setMode(v);
                            } else if (k === 'name') {
                                editor.setName(v);
                            } else {
                                // other settings cannot be changed without re-creating the JsonEditor
                                editor = createEditor(newValue);
                                $scope.updateJsonEditor();
                                return;
                            }
                        }
                    }
                }
            }, true);

            $scope.$on('$destroy', () => {
                editor = null;
            });

            $scope.updateJsonEditor = () => {
                editor.set(ngModel.$viewValue || {});
            };

            ngModel.$render = $scope.updateJsonEditor;

            $scope.$watch(() => ngModel.$modelValue, (newValue) => {
                // Do not update 2 times
                if (!angular.equals(newValue, editor.get())) {
                    $scope.updateJsonEditor();
                }
            }, true);
        }
    };
}
