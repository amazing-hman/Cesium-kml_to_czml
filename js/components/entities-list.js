import './entity-list-item.js';
import {labelForType, entityType} from './entity-type-label.js'

const template = `
<v-card color="grey lighten-1" flat class="mb-1" v-if="entities.length > 0">
    <v-toolbar dense flat dark color="black">
        <v-toolbar-title>KML Entities:</v-toolbar-title>
        <template v-slot:extension class="entites-ext">
        <template v-if="" v-for="key in supportedTypeFiltersShortList">
            <v-checkbox hide-details v-model="typeFilters[key]"></v-checkbox>
            {{typeLabel(key)}}
            <v-spacer></v-spacer>
        </template>

        <v-menu bottom left v-if="supportedTypeFilters.length > supportedTypeFiltersShortList.length">
            <template v-slot:activator="{ on, attrs }">
            <v-btn dark icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
            </template>

            <v-list dense>
            <v-list-item v-for="(_, key) in typeFilters">
                <v-list-item-content>
                <v-list-item-title>{{typeLabel(key)}}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                <v-checkbox hide-details v-model="typeFilters[key]"></v-checkbox>
                </v-list-item-action>
            </v-list-item>
            </v-list>
        </v-menu>
        </template>
    </v-toolbar>
    <v-card-text class="pa-0">
        <v-list color="grey lighten-1" dense height="200" class="overflow-y-auto py-0" id="scrollable-list">
        <v-list-item-group color="primary" :mandatory="true" :value="entity" active-class="highlight">
            <entity-list-item v-for="(e, i) in filteredEntities" :key="i" :entity="e"
                @select="selectEntity"
                :selected="e === entity"
                :is-folder="isFolder"
                @zoom-to="zoomToEntity"
                :id="getTargetId(e)">
            </entity-list-item>
        </v-list-item-group>
        </v-list>
    </v-card-text>
</v-card>
`;

Vue.component('entities-list', {
    props: ['entities', 'entity'],
    template,
    data: function() {
        return {
            typeFilters: {}
        };
    },
    methods: {
        selectEntity: function(entity) {
            this.$emit('select', entity);
        },
        zoomToEntity: function() {
            if (this.entity) {
                viewer.zoomTo(this.entity);
            }
        },
        isFolder: function(entity) {
            return entity.position === undefined && this.entities.some(e => {
                return e.parent && e.parent.id === entity.id;
            });
        },
        typeLabel: function(type) {
            return labelForType(type);
        },
        getTargetId(entity){
            let target = 's'+entity.id.replace(/-/gi,'');
            return target;
        }
    },
    computed: {
        filteredEntities() {
            const visibleTypes = Object.keys(this.typeFilters).filter(type => this.typeFilters[type]);

            // If all the filters checked, don't filter the list at all
            if (visibleTypes.length === this.supportedTypeFilters.length) {
                return this.entities;
            }

            return this.entities.filter(e => {
                return this.isFolder(e) || visibleTypes.indexOf[entityType(e)];
            });
        },
        supportedTypeFilters() {
            return Object.keys(this.typeFilters);
        },
        supportedTypeFiltersShortList() {
            return this.supportedTypeFilters.slice(0, 3);
        }
    },
    watch: {
        entities: function(newValue) {
            newValue.forEach(e => {
                const t = entityType(e);
                if (t) {
                    this.typeFilters[t] = true;
                }
            });
        }
    }
})