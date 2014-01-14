$ () ->
	Skill = Backbone.Model.extend(
		defaults: () ->
			skill: ""
			level: ""
	)
	Skills = Backbone.Collection.extend(
		model: Skill
		
	)

	App = new AppView